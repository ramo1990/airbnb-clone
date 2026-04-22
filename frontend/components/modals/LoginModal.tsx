"use client"

import { LoginFormValues } from '@/lib/types'
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


const LoginModal = () => {
    const registerModal = useRegisterModal()
    const loginModal = useLoginModal()
    const [isLoading, setIsLoading] = useState(false)
    const loadUser = useAuthStore((s) => s.loadUser)

    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormValues>({
        defaultValues: {
            email: "",
            password:""
        }
    })

    const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
        try {
            setIsLoading(true)
            loginModal.onClose()

            const tokensRes = await api.post("/login/", {email: data.email, password: data.password})
            const {access, refresh } = tokensRes.data

            if (typeof window !== "undefined") {
                localStorage.setItem("access", access)
                localStorage.setItem("refresh", refresh)
            }

            await loadUser()
            toast.success("Connexion réussie")

        } catch (error) {
            const err = error as AxiosError
            console.error('Erreur de connxion:', err.response?.data || error)
            toast.error("Email ou mot de passe incorrect")
        } finally {
            setIsLoading(false)
        }
    }

    const bodyContent = (
        <div className='flex flex-col gap-4'>
            <Heading title='Bon retour parmi nous' subtitle='Connectez-vous à votre compte'/>
            <Input id="email" label='Email' disabled={isLoading} register={register} errors={errors} required />
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
                onClick={() => {}}
            />

            <Button 
                variant="outline"
                label='Facebook'
                icon={FaFacebook}
                onClick={() => {}}
            />

            <div className='text-neutral-500 text-center mt-4 font-light'>
                <div className='justify-center flex flex-row items-center gap-2'>
                    Vous n&apos;avez  pas de compte ? 
                    <div 
                        onClick={() => {
                            loginModal.onClose()
                            registerModal.onOpen()
                        }}
                        className='text-neutral-950 cursor-pointer hover:underline'
                    >
                       Inscrivez-vous
                    </div>
                </div>

            </div>
        </div>
    )

    return (
        <Modal 
            disabled={isLoading}
            isOpen= {loginModal.isOpen}
            title='Se connecter'
            actionLabel="Continuer"
            onClose={loginModal.onClose}
            onSubmit={handleSubmit(onSubmit)}
            body={bodyContent}
            footer={footerContent}
        />
    )
}

export default LoginModal