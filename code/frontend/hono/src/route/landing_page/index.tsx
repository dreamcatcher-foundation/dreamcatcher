import {
  Absolute,
  Accordion,
  Box,
  Flex,
  Heading,
  Text
} from "chakra-ui";
import {
  render
} from "../render.tsx";
render(
  <Flex
  as=""
  fontSize="base"
  letterSpacing="normal"
  lineHeight="normal"
  wordBreak="normal"
  backgroundColor="#333"
  color="white"
  height="60px"
  padding="1rem"
  boxSizing="border-box"
  >
    <input 
    type="text"/>
    <div className="terminal"></div>
  </Flex>

);
/**
render(
  <Flex
  as=""
  fontSize="base"
  letterSpacing="normal"
  lineHeight="normal"
  wordBreak="normal"
  position="sticky"
  left="5"
  height="95vh"
  marginTop="2.5vh"
  boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
  width="200px"
  flexDirection="column"
  justifyContent="space-between">

    <Flex
    as=""
    fontSize="base"
    letterSpacing="normal"
    lineHeight="normal"
    wordBreak="normal"
    >
    </Flex>

    <Flex
    as=""
    fontSize="base"
    letterSpacing="normal"
    lineHeight="normal"
    wordBreak="normal"
    padding="5%"
    flexDirection="column"
    width="100%"
    alignItems="flex-start"
    marginBottom="4"
    >

      <Flex
      as=""
      fontSize="base"
      letterSpacing="normal"
      lineHeight="normal"
      wordBreak="normal"
      >

        <Heading
        as=""
        fontSize="base"
        letterSpacing="normal"
        lineHeight="normal"
        wordBreak="normal"
        >
          User Profile Name
        </Heading>
        <Text
        as=""
        fontSize="base"
        letterSpacing="normal"
        lineHeight="normal"
        wordBreak="normal"
        >
          0x0020203902038d929f
        </Text>
      </Flex>
    </Flex>
  </Flex>
);
*/
/**
render(
  <Flex /// page wrapper
  as="" 
  width="100%"
  height="200vh"
  flexDirection="column"
  fontSize="lg" 
  letterSpacing="normal" 
  lineHeight="normal" 
  wordBreak="normal" 
  backgroundColor="#191919" 
  color="#fff" 
  alignItems="center" 
  justifyContent="center" 
  margin="0" 
  padding="0">
    <Flex /// navbar
    as=""
    width="100%" 
    height="2.5%" 
    fontSize="lg" 
    letterSpacing="normal" 
    lineHeight="normal" 
    wordBreak="normal"
    alignContent="center">
    </Flex>
    <Flex /// section 01 hero section
    as="" 
    width="100%" 
    height="25%" 
    fontSize="lg" 
    letterSpacing="normal" 
    lineHeight="normal" 
    wordBreak="normal">
      Section 01 Hero Section
    </Flex>
    <Flex /// section 01
    as="" 
    width="100%" 
    height="25%" 
    fontSize="lg" 
    letterSpacing="normal" 
    lineHeight="normal" 
    wordBreak="normal">
      Section 01
    </Flex>
    <Flex /// section 02
    as="" 
    width="100%" 
    height="47.5%" 
    fontSize="lg" 
    letterSpacing="normal" 
    lineHeight="normal" 
    wordBreak="normal">
      Section 02
    </Flex>
  </Flex>
);
*/