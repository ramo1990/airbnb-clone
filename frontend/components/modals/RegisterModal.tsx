"use client"

import { RegisterFormValues } from '@/lib/types'
import useRegisterModal from '@/lib/useRegisterModal'
import React, { useState } from 'react'
import {SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../Heading'
import Input from '../Inputs/Input'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Modal from './Modal'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'
import useLoginModal from '@/lib/useLoginModal'
import { AxiosError } from 'axios'
import useAuthStore from '@/lib/useAuthStore'
import { signIn } from 'next-auth/react'


const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const [isLoading, setIsLoading] = useState(false)
    const loginModal = useLoginModal()
    const loadUser = useAuthStore((s) => s.loadUser)

    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password:""
        }
    })

    const onSubmit: SubmitHandler<RegisterFormValues> = async (data) => {
        try {
            setIsLoading(true)

            await api.post("/register/", data)

            const tokensRes = await api.post("/login/", {
                email: data.email,
                password: data.password
            })
            const {access, refresh} = tokensRes.data

            if (typeof window !== "undefined") {
                localStorage.setItem("access", access)
                localStorage.setItem("refresh", refresh)
            }

            await loadUser()
            toast.success("Compte crée avec succès")
            registerModal.onClose()
        } catch (error) {
            const err = error as AxiosError
            console.error("Erreur d'inscription:", err.response?.data || error)
            toast.error("Une erreur s'est produite")
        } finally {
            setIsLoading(false)
        }
        
    }

    const handleSocialLogin = async (provider: "google" | "facebook") => {
        const res = await signIn(provider, {redirect: false})

        if (res?.ok) {
            await loadUser()
            window.location.reload()
        }
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Bienvenue sur airbnb' subtitle='Créer un compte'/>
            <Input id="email" label='Email' disabled={isLoading} register={register} errors={errors} required />
            <Input id="name" label='Nom' disabled={isLoading} register={register} errors={errors} required />
            <Input id="password" type='password' label='Mot de passe' disabled={isLoading} register={register} errors={errors} required />
        </div>
    )

    const footerContent = (
        <div className='flex flex-col gap-4'>
            <hr />
            <Button 
                variant="outline"
                label='Google'
                icon={FcGoogle}
                onClick={() => handleSocialLogin("google")}
            />

            <Button 
                variant="outline"
                label='Facebook'
                icon={FaFacebook}
                onClick={() => handleSocialLogin("facebook")}
            />

            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Vous avez déjà un compte ? 
                    <div 
                        onClick={() => {
                            registerModal.onClose()
                            loginModal.onOpen()
                        }}
                        className='text-neutral-950 cursor-pointer hover:underline'
                    >
                        Se connecter
                    </div>
                </div>

            </div>
        </div>
    )

    return (
        <Modal 
            disabled={isLoading}
            isOpen= {registerModal.isOpen}
            title='Inscription'
            actionLabel="S'inscrire"
            onClose={registerModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default RegisterModal