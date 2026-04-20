"use client"

import { RegisterFormValues } from '@/lib/types'
import useRegisterModal from '@/lib/useRegisterModal'
import React, { useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import Heading from '../Heading'
import Input from '../Inputs/Input'
import { Button } from '../ui/button'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook } from 'react-icons/fa'
import Modal from './Modal'
import { api } from '@/lib/axios'
import toast from 'react-hot-toast'


const RegisterModal = () => {
    const registerModal = useRegisterModal()
    const [isLoading, setIsLoading] = useState(false)

    const {register, handleSubmit, formState: {errors}} = useForm<RegisterFormValues>({
        defaultValues: {
            name: "",
            email: "",
            password:""
        }
    })

    const onSubmit: SubmitHandler<FieldValues> = (data) => {
        setIsLoading(true)
        console.log(data)

        api.post("/register/", data)
        .then(() => {
            registerModal.onClose()
        })
        .catch(() => {
            toast.error("Une erreur s'est produite")
        })
        .finally(() => {
            setIsLoading(false)
        })
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
                    Vous avez déjà un compte ? 
                    <div 
                        onClick={registerModal.onClose}
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