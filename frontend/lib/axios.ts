import axios, {AxiosError, AxiosHeaders, AxiosRequestConfig} from "axios"


interface AxiosRequestConfigWithRetry extends AxiosRequestConfig {
    _retry?: boolean
}

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: unknown) => void;
    reject: (error: unknown) => void;
    config: AxiosRequestConfigWithRetry;
}[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error)
        } else {
            if (prom.config.headers instanceof AxiosHeaders) {
                prom.config.headers.set("Authorization", `Bearer ${token}`)
            } else {
                prom.config.headers = {
                    ...(prom.config.headers || {}),
                    Authorization: `Bearer ${token}`
                }
            }
            prom.resolve(api(prom.config))
        }
    })
    failedQueue = []
}

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {'Content-Type': 'application/json'}
})

api.interceptors.request.use((config) => {
    const access = typeof window !== "undefined" && localStorage.getItem("access")

    if (access) {
        config.headers = new AxiosHeaders({
            ...(config.headers || {}),
            Authorization: `Bearer ${access}`
        })
    }

    return config
})

api.interceptors.response.use(
    (response) => response,

    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfigWithRetry

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise ((resolve, reject) => {
                    failedQueue.push({resolve, reject, config: originalRequest})
                })
            }

            originalRequest._retry = true 
            isRefreshing = true

            try {
                const refresh = localStorage.getItem("refresh")
                if (!refresh) {
                    localStorage.removeItem("access")
                    localStorage.removeItem("refresh")

                    return Promise.reject(error)
                }

                const res = await api.post('/token/refresh/', {refresh})
                const newAccess = res.data.access

                localStorage.setItem("access", newAccess)
                processQueue(null, newAccess)

                originalRequest.headers = {
                    ...originalRequest.headers,
                    Authorization: `Bearer ${newAccess}`
                }

                return api(originalRequest)
            } catch (err) {
                processQueue(err, null)
                localStorage.removeItem("access")
                localStorage.removeItem("refresh")
                return Promise.reject(err)
            } finally {
                isRefreshing = false
            }
        }

    return Promise.reject(error)
    }
)