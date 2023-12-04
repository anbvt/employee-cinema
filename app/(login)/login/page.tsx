"use client"
import { useEffect } from "react";
import "./index.css";
import { useForm } from "react-hook-form";
import { signIn, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
interface IAccount {
    email?: string,
    password: string
}

const LoginPage = () => {
    const session = useSession();
    const { register, handleSubmit, formState: { errors } } = useForm({
        defaultValues: {
            email: "e_test@gmail.com",
            password: "zuhot12345"
        }
    });
    if(session.data?.user) redirect("/");
    useEffect(() => {

    }, []);

    const onSubmit = async (data: IAccount) => {
        const result = await signIn("credentials", {
            email: data.email,
            password: data.password,
            redirect: true
        });
    }

    return (
        <div className="container mx-auto bg-login" style={{ height: "707px" }}>
            <div className="flex justify-center items-center" style={{ height: "100%" }}>
                <div className="w-full max-w-md">
                    <div className="bg-gray-100 shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <h2 className="text-center text-2xl font-semibold text-green-600">Zuhot Cinema (Nhân viên)</h2>
                        <div className="bg-cover bg-fixed" />
                        <form onSubmit={handleSubmit(onSubmit)} method="post">
                            <div className="mb-4">
                                <label className="text-gray-700" htmlFor="email">Email</label>
                                <input type="text" {...register("email", {
                                    required: {
                                        value: true,
                                        message: "Vui lòng nhập email"
                                    }
                                })} name="email" className="bg-gray-200 rounded border-2 w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-300" placeholder="Email" />
                                {errors.email && <p className="text-red-500">{errors.email.message}</p>}
                            </div>
                            <div className="mb-4">
                                <label className="text-gray-700" htmlFor="password">Mật khẩu</label>
                                <input type="password" {...register("password", {
                                    required: {
                                        value: true,
                                        message: "Vui lòng nhập mật khẩu"
                                    }
                                })} id="password" name="password" className="bg-gray-200 rounded border-2 w-full py-2 px-3 text-gray-700 focus:outline-none focus:bg-gray-300" placeholder="Mật khẩu" />
                                {errors.password && <p className="text-red-500">{errors.password.message}</p>}
                            </div>
                            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">
                                Đăng nhập
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default LoginPage;