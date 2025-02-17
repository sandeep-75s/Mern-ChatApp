import { VStack ,Input , Button  } from '@chakra-ui/react'
import { PasswordInput } from "../../components/ui/password-input"
import { Field } from '../../components/ui/field'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
// const {cloudinaryConnect} = require("../../config/cloudinary")
function SignUp() {
  
  const BASE_URL =
    process.env.NODE_ENV === "production"
    ? "https://chatconnect-in5b.onrender.com"  // Replace with your deployed backend URL
    : "http://localhost:5000";
    // cloudinaryConnect()
    const navigate = useNavigate();
    const [name , setName] = useState();
    const [email , setEmail] = useState();
    const [password , setPassword] = useState();
    const [confirmPassword , setConfirmPassword] = useState();
    const [pic , setPic] = useState();
    const [loading , setLoading] = useState(false);


    const postDetails = async (pic) =>{
      setLoading(true);
      if(pic === undefined){
        toast.error(
          "please select an image",
          {
            duration:5000,
            position:"top-center",
          }
        );
        return;
      }
      console.log("i am postDerails")

      if(pic.type === "image/jpeg" || pic.type === "image/png"){
        const data = new FormData();
        data.append("file",pic);
        data.append("upload_preset","chat-app");
        data.append("cloud_name","dhwrrpfek");
        console.log("loading")
        console.log(data);
        await fetch("https://res.cloudinary.com/dhwrrpfek/image/upload" , {
          method:'post',
          body: data
        }).then((res)=>res.json())
        .then((data)=>{
          setPic(data.url.toString());
          console.log(data.url.toString());
          setLoading(false);
        })
        .catch((error)=>{
          console.log(error);
          setLoading(false);
        });
      }else{
        toast.error(
          "image should be jpeg or png",
          {
            duration:5000,
            position:"top-center",
          }
        );
        setLoading(false);
        return;
      }
    }

    const submitHandler = async () =>{
      setLoading(true);
      if(!name || !email || !password || !confirmPassword){
        toast.error(
          "please fill all the data",
          {
            duration:5000,
            position:"top-center",
          }
        );
        setLoading(false);
        return;
      }
      if(password !== confirmPassword){
        toast.error("Password does not match",{
          duration:5000,
          position:"top-center"
        });
        return;
      }
      try{
        const config = {
          headers:{
            "Content-type":"application/json"
          },
        }
        const {data} = await axios.post(`${BASE_URL}/api/user`,
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        toast.success(
          "Registration is successfull",
          {
            duration:5000,
            position:"top-center"
          }
        );
        console.log(data);
        localStorage.setItem("userInfo",JSON.stringify(data));
        navigate("/chats")

      }catch(e){
        toast.error(`error occur ${e.message}`,
          {
            duration:5000,
            position:"top-center"
          }
        );
        setLoading(false);
      }
    }
  return (
    <VStack spacing="5px">

        <Field label="Name" required  >
          <Input 
          name="name" 
          required 
          placeholder='Enter Your Name'
          onChange={(e)=>setName(e.target.value)}/>
        </Field>

        <Field label="Email address" required  helperText="We'll never share your email.">
          <Input 
          name="email" 
          type="email" 
          required 
          placeholder='Enter Your Email'
          onChange={(e)=>setEmail(e.target.value)}/>
        </Field>

        <Field label="Password" required>
          <PasswordInput
          placeholder='Enter Your Password'
          onChange={(e)=>setPassword(e.target.value)}/>
        </Field>

        <Field label="Confirm Password" required>
          <PasswordInput
          placeholder='Enter Your Confirm Password'
          onChange={(e)=>setConfirmPassword(e.target.value)}/>
        </Field>

        <Field label="Upload Your Picture" >
          <Input 
          name="file" 
          type="file"
          p="5px"
          required 
          accept='image/*'
          onChange={(e)=>postDetails(e.target.files[0])}/>
        </Field>

      <Button 
        bg="#4E9DDF"
        color={"white"}
        fontWeight={"bold"}
        fontSize={"lg"}
        style={{marginTop:15}}
        width="100%"
        onClick={submitHandler}
        >
            SignUp
      </Button>
    </VStack>
  )
}

export default SignUp
