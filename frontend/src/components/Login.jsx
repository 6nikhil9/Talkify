import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";

const LoginSignup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSignup, setIsSignup] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleAuth = async (e) => {
    e.preventDefault();
    const type = isSignup ? "signup" : "login";
    try {
      const url = `https://talkify-loau.onrender.com/auth/${type}`;
      const response = await axios.post(url, { username, password });
      if (type === "login") {
        localStorage.setItem("token", response.data.token);
        navigate("/talkify");
      } else {
        toast({
          title: "Signup Successful",
          description: "Please log in to continue.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        setIsSignup(false);
      }
    } catch (error) {
      toast({
        title: `${isSignup ? "Signup" : "Login"} Failed`,
        description: error.response?.data?.message || "An unknown error occurred.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      h="100vh"
      bgGradient="linear(to-r, purple.500, indigo.900)"
    >
      <VStack spacing={4} align="center">
        <Heading as="h1" size="2xl" color="white" textShadow="2px 2px 4px rgba(0,0,0,0.3)">
          Talkify
        </Heading>
        <Text fontSize="xl" color="white">
          Your ultimate translator and speech app
        </Text>
        <Box
          as="form"
          onSubmit={handleAuth}
          p={8}
          bg="whiteAlpha.100"
          borderRadius="lg"
          boxShadow="md"
          w="full"
          maxW="xs"
          borderWidth="1px"
          borderColor="purple.300"
          backdropFilter="blur(10px)"
        >
          <VStack spacing={4}>
            <Heading as="h2" size="lg" color="purple.300">
              {isSignup ? "Sign Up" : "Login"}
            </Heading>
            <FormControl>
              <FormLabel color="white">Username</FormLabel>
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                focusBorderColor="purple.300"
              />
            </FormControl>
            <FormControl>
              <FormLabel color="white">Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                focusBorderColor="purple.300"
              />
            </FormControl>
            <Button type="submit" colorScheme="purple" w="full">
              {isSignup ? "Sign Up" : "Login"}
            </Button>
            <Text fontSize="sm" color="white">
              {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button
                variant="link"
                colorScheme="purple"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign Up"}
              </Button>
            </Text>
          </VStack>
        </Box>
      </VStack>
    </Flex>
  );
};

export default LoginSignup;
