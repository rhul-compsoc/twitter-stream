import Footer from '@components/footer';
import MainLayout from '@components/layouts/mainLayout';
import { Field, Form, Formik } from 'formik';
import Head from 'next/head';
import { useRef, useState } from 'react';
import z from 'zod';
import { NextPageWithLayout } from './_app';

const submitSchema = z.object({
    name: z.string().min(2, 'Minimum 2 chars long'),
    message: z.string().min(5, 'Minimum 5 chars long')
});

const Submit: NextPageWithLayout = () => {
    const hasSubmitted = useRef(false);

    const [fetchSuccess, setFetchSuccess] = useState<boolean | null>(null);

    return (
        <>
            <Head>
                <title>Submission!</title>
            </Head>
            <h1 className="mb-10 bg-base-300 p-4 text-center text-2xl font-bold">
                SU Social Wall Submission
            </h1>
            {fetchSuccess == null && (
                <Formik
                    initialValues={{ name: '', message: '' }}
                    validate={(values) => {
                        const errors = submitSchema.safeParse(values);
                        if (!errors.success) {
                            return Object.fromEntries(
                                errors.error.issues.map((v) => [
                                    v.path[0],
                                    v.message
                                ])
                            );
                        }
                    }}
                    onSubmit={(values) => {
                        if (!hasSubmitted.current) {
                            fetch('/api/messages/submit', {
                                method: 'POST',
                                body: JSON.stringify(values)
                            })
                                .then((req) => req.json())
                                .then((res) => {
                                    setFetchSuccess(res.success);
                                });
                            hasSubmitted.current = true;
                        }
                    }}
                >
                    {({ errors, touched }) => (
                        <Form className="flex flex-col items-center p-6">
                            <div className="form-control my-2 w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">
                                        What is your name?
                                    </span>
                                    {errors.name && touched.name && (
                                        <span className="label-text-alt text-error">
                                            {errors.name}
                                        </span>
                                    )}
                                </label>
                                <Field
                                    name="name"
                                    placeholder="Type here"
                                    className="input-bordered input w-full max-w-xs"
                                />
                            </div>
                            <div className="form-control my-2 w-full max-w-xs">
                                <label className="label">
                                    <span className="label-text">
                                        What is your message?
                                    </span>
                                    {errors.message && touched.message && (
                                        <span className="label-text-alt text-error">
                                            {errors.message}
                                        </span>
                                    )}
                                </label>
                                <Field
                                    as="textarea"
                                    name="message"
                                    className="textarea-bordered textarea h-24"
                                    placeholder="the message to the big wall"
                                />
                            </div>
                            <Field
                                type="submit"
                                value="Submit to wall"
                                className="btn my-6 w-full max-w-xs"
                            />
                        </Form>
                    )}
                </Formik>
            )}

            {fetchSuccess != null && (
                <div className="p-7">
                    {fetchSuccess ? (
                        <>
                            <p className="text-center text-success">
                                Submission successful!
                            </p>
                            <p className="my-10 text-center">
                                Refresh the page to make another submission.
                                <br />
                                <br />
                                Or wait to see your post on the big screen!
                            </p>
                        </>
                    ) : (
                        <span>did not work :(</span>
                    )}
                </div>
            )}
            <Footer></Footer>
        </>
    );
};

Submit.getLayout = (page) => <MainLayout className="flex">{page}</MainLayout>;

export default Submit;
