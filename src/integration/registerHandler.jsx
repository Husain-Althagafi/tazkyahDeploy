import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

function RegisterHandler() {
    const navigate = useNavigate()

    useEffect(() => {
        const form = document.getElementById("registerForm")
        if (!form) return;

        const handleSubmit = async (e) => {
            e.preventDefault()

            const firstName = document.getElementById("r-fname").value
            const lastName = document.getElementById("r-lname").value            
            const email = document.getElementById("r-email").value
            const password = document.getElementById("r-password").value

            console.log(JSON.stringify({ firstName, lastName, email, password }))

            try {
                const res = await fetch("http://localhost:5000/api/auth/register", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ firstName, lastName, email, password }),
                })

                const data = await res.json()

                if (res.ok) {
                    localStorage.setItem('token', data.token)
                    console.log('Registration successful!')
                    navigate('/')
                } else {
                    alert(data.message || data.error)
                }
            } catch (err) {
                console.error(err)
                alert('Something went wrong.')
            }
        }

        form.addEventListener("submit", handleSubmit)

        return () => {
            form.removeEventListener("submit", handleSubmit)
        }
    }, [navigate])

    return null
}

export default RegisterHandler
