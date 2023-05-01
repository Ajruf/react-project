import { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { supabase } from './supabaseClient';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import {v4 as uuidv4 } from 'uuid';
import Jumbotron from './components/Jumbotron';
import useAxios from './hooks/useAxios';
import { createContext, useContext } from "react"

// https://urumcptjucxdcmugsmge.supabase.co/storage/v1/object/public/images/72faf4c3-b8e9-45d3-bf49-c383605131d9/7c1dd722-96c1-47c6-8a0d-4b4375f69d5e

const CDNURL = "https://urumcptjucxdcmugsmge.supabase.co/storage/v1/object/public/images/";

export const ImageContext = createContext();

function App() {
  const [ email, setEmail ] = useState("");
  const [ images, setImages ] = useState([]);
  const user = useUser();
  const supabase = useSupabaseClient();
  
  async function getImages() {
    const { data, error } = await supabase
    .storage
    .from('images')
    .list(user?.id + "/", {
      limit: 100,
      offset: 0,
      sortBy: { column: "name", order: "asc" }
    })

    if(data !== null) {
      setImages(data);
    } else {
      console.log(error);
    }
  }

  useEffect(() => {
    if(user) {
      getImages();
    }
  }, [user]);

  async function magicLinkLogin() {
    const { data, error } = await supabase.auth.signInWithOtp({
      email: email
    })

    if(error) {
      alert("Error communcating with supabase, please use a real Email");
    } else {
      alert("Check your email for a supabase link to log-in")
    }
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
  }
  
  async function uploadImage(e) {
    let file = e.target.files[0];

    const { data, error } = await supabase
      .storage
      .from('images')
      .upload(user.id + "/" + uuidv4(), file)

      if(data) {
        getImages();
      } else {
        console.log(error);
      }
  }

  async function deleteImage(imageName) {
    const { error } = await supabase
    .storage
    .from('images')
    .remove([ user.id + "/" + imageName])

    if(error) {
      alert(error)
    } else {
      getImages();
    }

  }

  const { response, isLoading, error, fetchData } = useAxios(`search/photos?page=1&query=office&client_id=${process.env.REACT_APP_ACCESS_KEY}`);
  const value = {
    response,
    isLoading,
    error,
    fetchData
  }

  const Images = () => {
    const { response, isLoading, } = useContext(ImageContext);
  }


  return (
    <>
    <div class="position-relative" align="center">
      <div class="card w-75 mt-5">
      <Container align="center" className="cotainer-sm mt-4">
        { user === null ?
        <>
        <h1>Welcome to ImageUploader</h1>
        <Form>
          <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
            <Form.Label>Enter an email to sign in with a Supabase Magic Link</Form.Label>
            <Form.Control type="email" placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)}>
              
            </Form.Control>
          </Form.Group>
          <Button variant="primary" onClick={() => magicLinkLogin()}>Get Log-In Link</Button>
        </Form>
        </>
      :
        <>
          <h1>Welcome to your gallery</h1>
          <p>Current user: {user.email}</p>
          <p>Use the Choose File button to upload an image to your gallery</p>
          <Form.Group className="mb-3" style={{maxWidth: "500px"}}>
            <Form.Control type="file" accept="image/png, image/jpeg" onChange={(e) => uploadImage(e)}/>
          </Form.Group>
          <Button variant="primary" onClick={() => signOut()}>Sign Out</Button>
          <hr />
          <h3>Your Images</h3>
          {<Row xs={1} md={3} className="g-4">
            {images.map((image) => {
              return(
                <Col key={CDNURL + user.id + "/" + image.name}>
                  <Card>
                    <Card.Img variant="top" src={CDNURL + user.id + "/" + image.name } />
                    <Card.Body>
                       <Button variant="danger" onClick={() => deleteImage(image.name)}>Delete Image</Button>
                    </Card.Body>
                  </Card>
                </Col>
              )
            })}
          </Row>}
        </>
      }
      </Container>
      </div>
    </div>
    <ImageContext.Provider value={value}>
    <Jumbotron></Jumbotron>
    </ImageContext.Provider>
    </>
  )
}
export default App;
