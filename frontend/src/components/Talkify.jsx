import React, { useState, useEffect } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { HiSpeakerWave } from "react-icons/hi2";
import { FaStopCircle, FaSun, FaMoon } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LanguagesSelect from "./LanguagesSelect";
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Select,
  Text,
  useColorMode,
  useToast,
  VStack,
  List,
  ListItem,
  useTheme,
} from "@chakra-ui/react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionList = motion(List);
const MotionListItem = motion(ListItem);
const MotionIconButton = motion(IconButton);

const Talkify = () => {
  const navigate = useNavigate();
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLang, setSourceLang] = useState("en");
  const [targetLang, setTargetLang] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const { colorMode, toggleColorMode } = useColorMode();
  const toast = useToast();
  const theme = useTheme();
  const { transcript, listening, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    if (transcript) {
      setSourceText(transcript);
    }
  }, [transcript]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://talkify-loau.onrender.com/api/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data.history);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        "https://talkify-loau.onrender.com/api/translate",
        { text: sourceText, sourceLang, targetLang },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTranslatedText(response.data.translatedText);
      setHistory((prevHistory) => [...prevHistory, response.data]);
    } catch (error) {
      console.error("Translation error:", error);
      toast({
        title: "Translation Error",
        description: "Failed to translate text. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeechToText = () => {
    if (listening) {
      SpeechRecognition.stopListening();
      resetTranscript();
    } else {
      SpeechRecognition.startListening({ continuous: true });
    }
  };

  const handleTextToSpeech = () => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(translatedText);
      utterance.lang = targetLang;
      speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Unsupported Feature",
        description: "Speech synthesis is not supported in your browser.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(translatedText).then(() => {
      toast({
        title: "Copied to Clipboard",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }).catch((err) => {
      console.error("Failed to copy text: ", err);
      toast({
        title: "Copy Error",
        description: "Failed to copy text to clipboard.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    });
  };

  const textareaStyles = {
    width: "100%",
    padding: "1rem",
    borderRadius: "0.375rem",
    backgroundColor: colorMode === "dark" ? theme.colors.dark.surface : theme.colors.light.surface,
    color: colorMode === "dark" ? theme.colors.dark.text : theme.colors.light.text,
    borderColor: colorMode === "dark" ? theme.colors.dark.primary : theme.colors.light.primary,
    borderWidth: "1px",
    resize: "none",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <Container centerContent>
        <Text>Browser doesn't support speech recognition.</Text>
      </Container>
    );
  }

  return (
    <Container maxW="container.lg" py={10}>
      <VStack spacing={8} align="stretch">
        <Flex justify="space-between" align="center">
          <Heading as="h1" size="xl">
            Talkify - Translate & Speak
          </Heading>
          <HStack>
            <MotionIconButton
              aria-label="Toggle theme"
              icon={colorMode === "dark" ? <FaSun /> : <FaMoon />}
              onClick={toggleColorMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <MotionButton
              onClick={handleLogout}
              variant="link"
              colorScheme="purple"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              Logout
            </MotionButton>
          </HStack>
        </Flex>

        <MotionBox variants={itemVariants}>
          <VStack spacing={4}>
            <TextareaAutosize
              minRows={3}
              maxRows={6}
              placeholder="Enter text to translate"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              style={textareaStyles}
            />
            <HStack w="full">
              <Select value={sourceLang} onChange={(e) => setSourceLang(e.target.value)}>
                <LanguagesSelect />
              </Select>
              <Select value={targetLang} onChange={(e) => setTargetLang(e.target.value)}>
                <LanguagesSelect />
              </Select>
            </HStack>
            <MotionButton
              onClick={handleTranslate}
              isLoading={isLoading}
              loadingText="Translating..."
              colorScheme="purple"
              w="full"
              size="lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Translate
            </MotionButton>
          </VStack>
        </MotionBox>

        <AnimatePresence>
          {translatedText && (
            <MotionBox
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <VStack spacing={4}>
                <Heading as="h2" size="md">
                  Translated Text:
                </Heading>
                <TextareaAutosize
                  minRows={3}
                  maxRows={6}
                  value={translatedText}
                  readOnly
                  style={textareaStyles}
                />
                <MotionButton
                  onClick={handleCopyToClipboard}
                  colorScheme="purple"
                  w="full"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Copy to Clipboard
                </MotionButton>
              </VStack>
            </MotionBox>
          )}
        </AnimatePresence>

        <HStack spacing={4}>
          <MotionButton
            onClick={handleTextToSpeech}
            leftIcon={<HiSpeakerWave />}
            colorScheme="purple"
            w="full"
            isDisabled={!translatedText}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Play Translated Text
          </MotionButton>
          <MotionButton
            onClick={handleSpeechToText}
            leftIcon={listening ? <FaStopCircle /> : <HiSpeakerWave />}
            colorScheme={listening ? "red" : "purple"}
            w="full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {listening ? "Stop Listening" : "Start Listening"}
          </MotionButton>
        </HStack>

        <MotionBox variants={itemVariants}>
          <Heading as="h2" size="lg" mb={4}>
            Translation History
          </Heading>
          <MotionList spacing={3} variants={containerVariants} initial="hidden" animate="visible">
            {history.map((entry, index) => (
              <MotionListItem
                key={index}
                p={4}
                borderWidth="1px"
                borderRadius="lg"
                variants={itemVariants}
              >
                <Text fontWeight="bold">Original: {entry.originalText}</Text>
                <Text>Translation: {entry.translatedText}</Text>
              </MotionListItem>
            ))}
          </MotionList>
        </MotionBox>
      </VStack>
    </Container>
  );
};

export default Talkify;
