import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

function LoginHandler() {
    const navigate = useNavigate()

    useEffect(() => {
        const form = document.getElementById("loginForm")
        if (!form) return;

        const handleSubmit = async (e) => {
            e.preventDefault()

            const email = document.getElementById("l-email").value
            const password = document.getElementById("ol-password").value

            try {
                const res = await fetch("http://localhost:5000/api/auth/login", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                })

                const data = await res.json()

                if (res.ok) {
                    localStorage.setItem('token', data.token)
                    console.log('Login successful!')
                    navigate('/')
                } else {
                    alert(data.message || data.error)
                }
            } catch (err) {
                console.error(err)
                alert(err)
            }
        }

        form.addEventListener("submit", handleSubmit)

        return () => {
            form.removeEventListener("submit", handleSubmit)
        }
    }, [navigate])

    return null
}

export default LoginHandler
