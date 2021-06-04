import React from 'react';
import {useMe} from "../hooks/useMe";
import {Button} from "../components/button";
import {gql, useApolloClient, useMutation} from "@apollo/client";
import {useForm} from "react-hook-form";
import {editProfile, editProfileVariables} from "../__generated__/editProfile";


const EDIT_PROFILE_MUTATION = gql`
    mutation editProfile($input: EditProfileInput!) {
        editProfile(input : $input) {
            ok
            error
        }
    }
`


interface IFormProps {
    email?: string;
    password?: string;
}


export const EditProfile = () => {


    const {data: userData} = useMe();
    const client = useApolloClient();
    const onCompleted = (data: editProfile) => {
        const {editProfile: {error, ok}} = data;
        if (ok && userData) {
            const {me: {email: prevEmail, id}} = userData;
            const {email: newEmail} = getValues();
            if (prevEmail !== newEmail) {
                client.writeFragment({
                    id: `User:${id}`,
                    fragment: gql`
                        fragment EditedUser on User {
                            verified
                            email
                        }
                    `,
                    data: {
                        email: newEmail,
                        verified: false,
                    },
                });
            }
        }
    }


    const [editProfile, {loading: editLoading}] = useMutation<editProfile, editProfileVariables>(EDIT_PROFILE_MUTATION, {
        onCompleted
    })

    const {register, handleSubmit, getValues, formState} = useForm<IFormProps>({
        mode: "onChange",
        defaultValues: {
            email: userData?.me?.email,
        }
    });

    const onSubmit = async () => {
        const {email, password} = getValues();
        await editProfile({
            variables: {
                input: {
                    email,
                    ...(password !== "" && {password})
                }
            }
        })
    }


    return (
        <div className="mt-52 flex flex-col justify-center items-center">
            <h4 className={"font-semibold text-2xl mb-3"}>Edit Profile</h4>
            <form onSubmit={handleSubmit(onSubmit)} className={"grid max-w-screen-sm gap-3 mt-5 w-full mb-5"}>
                <input ref={register({
                    pattern: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                })} name={'email'} className={'input'} type={"email"} placeholder={'Email'}
                       required={true}/>
                <input ref={register} name={'password'} className={'input'} type={"password"} placeholder={'password'}/>
                <Button canClick={formState.isValid} loading={editLoading} actionText={"Save Profile"}/>
            </form>
        </div>
    )
}