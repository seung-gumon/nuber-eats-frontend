import {gql, useApolloClient, useMutation} from "@apollo/client";
import React, {useEffect} from "react";
import {useMe} from "../hooks/useMe";
import {
    verifiyEmail,
    verifiyEmailVariables,
} from "../__generated__/verifiyEmail";
import {useHistory} from "react-router-dom";

const VERIFY_EMAIL_MUTATION = gql`
    mutation verifiyEmail($input: VerifyEmailInput!) {
        verifyEmail(input: $input) {
            ok
            error
        }
    }
`;

export const ConfirmEmail = () => {
    const {data: userData} = useMe();
    const client = useApolloClient();
    const history = useHistory();

    const onCompleted = (data: verifiyEmail) => {
        const {
            verifyEmail: {ok},
        } = data;
        if (ok && userData?.me) {
            client.writeFragment({
                id: `User:${userData?.me.id}`,
                fragment: gql`
                    fragment VerifiedUser on User {
                        verified
                    }
                `,
                data: {
                    verified: true,
                },
            });
            return history.push('/');
        }
    };

    const [verifyEmail] = useMutation<verifiyEmail, verifiyEmailVariables>(
        VERIFY_EMAIL_MUTATION,
        {
            onCompleted,
        }
    );

    useEffect(() => {
        const [_, code] = window.location.href.split("code=");
        verifyEmail({
            variables: {
                input: {
                    code,
                },
            },
        });
    }, []);

    return (
        <div className="mt-52 flex flex-col items-center justify-center">
            <h2 className="text-lg mb-1 font-medium">Confirm Email...</h2>
            <h4 className="text-gray-700 text-sm">
                Please wait, don't close this page...
            </h4>
        </div>
    );
};
