import Footer from '@components/footer';
import MainLayout from '@components/layouts/mainLayout';
import { Field, Form, Formik } from 'formik';
import { useRef } from 'react';
import z from 'zod';
import { NextPageWithLayout } from './_app';

const submitSchema = z.object({
    name: z.string().min(2, 'Minimum 2 chars long'),
    message: z.string().min(5, 'Minimum 5 chars long')
});

const Submit: NextPageWithLayout = () => {
    const hasSubmitted = useRef(false);

    return (
        <>
            <h1 className="mt-3 mb-10 text-center text-2xl font-bold">
                SU Social Wall Submission
            </h1>
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
            <Footer></Footer>
        </>
    );
};

Submit.getLayout = (page) => <MainLayout className="flex">{page}</MainLayout>;

export default Submit;
