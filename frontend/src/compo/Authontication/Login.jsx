import { VStack , Input , Button } from '@chakra-ui/react'
import { Field } from '../../components/ui/field'
import { useState } from 'react'
import { PasswordInput } from "../../components/ui/password-input"
import React from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
function Login() {
    const BASE_URL =   `http://localhost:5000`;
    const navigate = useNavigate()
    const [email , setEmail] = useState();
    const [password , setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const submitHandler = async() => {
        setLoading(true);
        if(!email || !password){
            toast.error("please fill all data");
            setLoading(false);
            return;
        }
        try{
            const config = {
                headers: { "Content-Type": "application/json" },
            };
            
            const { data } = await axios.post(`${BASE_URL}/api/user/login`, { email, password }, config);
            localStorage.setItem("userInfo", JSON.stringify(data));
            toast.success("Login Successful", { duration: 5000 });
            navigate("/chats");
            
        }catch(e){
            console.log(e)
        }
    }
  return (
    <VStack>
        <Field label="Email address" required  helperText="We'll never share your email.">
            <Input 
            name="email" 
            type="email" 
            value={email}
            required 
            placeholder='Enter Your Email'
            onChange={(e)=>setEmail(e.target.value)}/>
        </Field>
        <Field label="Password" required>
            <PasswordInput
            placeholder='Enter Your Password'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}/>
        </Field>

        <Button 
            bg="#4E9DDF"
            color={"white"}
            fontWeight={"bold"}
            fontSize={"lg"}
            style={{marginTop:15}}
            width="100%"
            onClick={submitHandler}>
                Login
        </Button>

        <Button 
            bg="#FA1D2E"
            color={"white"}
            fontWeight={"bold"}
            fontSize={"lg"}
            style={{marginTop:15}}
            width="100%"
            onClick={()=>{
                setEmail("guest@example.com");
                setPassword("123");
            }}>
                Get Guest User Credential
        </Button>
    </VStack>
  )
}

export default Login
