import React, { useState, useEffect } from 'react';
import './App.css';
import styled from 'styled-components'

import { FaLightbulb } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';

const App: React.FC = () => {
  
  const [haikuText, setHaikuText] = useState('')
  const [syllabeCount, setSyllabeCount] = useState('')

  const [imageSource, setImageSource] = useState('')
  const [imageWidth, setImageWidth] = useState(0)
  const [imageHeight, setImageHeight] = useState(0)

  const countSyllabes: Function = (initialword: string) => {
    
    let word: string = initialword.toLowerCase()
    
    if(word.length < 1) return 0;
    if(word.length <= 2) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, "")
    word = word.replace(/^y/, "")
    const result = word.match(/[aeiouy]{1,2}/g)

    const hiatos: RegExpMatchArray = initialword.match(/a[eoíú]|e[aoíú]|o[aeíú]|í[aeo]|ú[aeo]/g) || []
    
    if(result) {
      return result.length + hiatos.length
    } else {  
      return 0
    }
  }

  const parseText = (e: React.ChangeEvent) => {
    const value: string = (e.target as HTMLTextAreaElement).value
    const auxhaikuText: string = value
    
    const lines: Array<string> = auxhaikuText.split(/\n/)
    let syllabeResult: string = ''
    for(const line of lines) {
      const ns: number = countSyllabes(line)
      syllabeResult += ((ns !== 0) ? String(ns) : '') + '\n'
    }

    setHaikuText(auxhaikuText)
    setSyllabeCount(syllabeResult)
  }

  const sendTweet = () => {
    const publishtext: string = escape(haikuText + '\n\n') 
    const url: string = `https://twitter.com/intent/tweet?hashtags=Haiku&text=${publishtext}`
    window.open(url)
  }

  const apiKey: string = '17994973-630511a782eee19f899d5fd17'
  const queryString: string = escape(haikuText)
  const searchUrl: string = `https://pixabay.com/api/?key=${apiKey}&q=${queryString}&image_type=photo`

  const getImages = async () => {
    let response: Response = await fetch(searchUrl) 
    let responseOK = response && response.ok;
    if (responseOK) {
      let data = await response.json();
      // do something with data
      console.log(data)
      const imageArray: Array<any> = data.hits
      
      if(imageArray.length > 0) {
        const selectedImage: any = imageArray[Math.floor(Math.random() * imageArray.length)]
        const imagePreviewURL: string = selectedImage.webformatURL
        const imageWidth: number = selectedImage.webformatWidth
        const imageHeight: number = selectedImage.webformatHeight

        setImageSource(imagePreviewURL)
        setImageWidth(imageWidth)
        setImageHeight(imageHeight)
      }
    }
  }

  useEffect(()=>{
    getImages()
  },[])

  return (
    <AppContainer>
      <HeaderContainer>
      <h1>
          <b>TwaikUmatic 1.0</b> :: Pelayo Méndez 2020
        </h1> 
        <h2>
          Distraction Free #haiku #senryu Twitter writting machine.<br/>
        </h2>  
      </HeaderContainer>
      <ComposerContainer>
        <ComposerHeaderContainer>
          <button onClick={getImages}>
            <FaLightbulb /> 
          </button>
          <button onClick={sendTweet}>
            <FaTwitter />
          </button>
        </ComposerHeaderContainer>
        <ImageContainer style={{backgroundImage: `url(${imageSource})`}} />
        <TextContainer>
          <HaikuCount value={syllabeCount} readOnly></HaikuCount>
          <HaikuText value={haikuText} onChange={parseText} placeholder="Haiku: Poema japonés de 17 sílabas nacido de la escisión del haikai, del cual se conservaron solo los tres versículos iniciales (de 5, 7 y 5 sílabas respectivamente)."></HaikuText>
        </TextContainer>
      </ComposerContainer>
      <FooterContainer>
        
        <h3>
          Images powered by:
        </h3>
          <a href="https://pixabay.com/" target="_blank">
            <img src="https://pixabay.com/static/img/logo.png" width="100px" />
        </a>
      </FooterContainer>
    </AppContainer>
  );
}


const AppContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 90px;
`

const HeaderContainer = styled.div`
  color: #bfbfbf;
  position: fixed;
  left: 30px;
  bottom: 30px;
  h1 {
    font-size: 12px;
  }
  h2 {
    font-size: 11px;
  }
`

const ComposerContainer = styled.div`

`

const ComposerHeaderContainer = styled.div`
  display: flex;
  align-items: right;
  justify-content: flex-end;
  button {
    color: grey;
    font-size: 18px;
    margin-left: 15px;
    cursor: pointer;
    border: 0;
    background: none;
    box-shadow: none;
    border-radius: 0px;
  }
  button:hover {
    color: black;
  }
`

const TextContainer = styled.div`
  width: 100%;
  display: flex;
  margin-top: 15px;
  textarea {
    resize: none;
    border: none;
    height: 150px;
  }
`

const HaikuCount = styled.textarea`
  width: 40px;
  float: left;
  text-align: justify;
  -moz-text-align-last: center; /* Firefox 12+ */
  text-align-last: center;
`

const HaikuText = styled.textarea`
  width: 100%;
`

const ImageContainer = styled.div`
  width: 480px;
  height: 420px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: 50% 50%;
`

const FooterContainer = styled.div`
  color: #bfbfbf;
  position: fixed;
  right: 30px;
  bottom: 30px;
  text-align: center;

  h3 {
    font-size: 11px;
  }
  img {
    filter: invert(100%);
  }
`

export default App;
