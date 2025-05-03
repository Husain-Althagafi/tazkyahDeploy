import { useEffect } from "react"
import { useNavigate } from 'react-router-dom'

//connecting UI to the function
function RegisterHandler() {
    const navigate = useNavigate()
    useEffect(() => {
        const form = document.getElementById("registerForm")
        if(!form) return;

        form.addEventListener("submit", async(e) => {
            e.preventDefault()

            const username = document.getElementById("r-username").value
            const email = document.getElementById("r-email").value
            const password = document.getElementById("r-password").value
            try {
                const res = await fetch("http://localhost:5005/api/auth/register", {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password}),
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
        })
    })
    return null
}

export default RegisterHandler
