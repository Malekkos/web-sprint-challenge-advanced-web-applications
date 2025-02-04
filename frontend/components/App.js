import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'
import { axiosWithAuth } from '../axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  // ✨ MVP can be achieved with these states

  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const [currentArticle, setCurrentArticle] = useState()


  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => { 
    navigate("")
   }
  const redirectToArticles = () => { 
    navigate("/articles")
   }

  function ProtectedRoute() {
    redirectToLogin()
  }
  const logout = () => {
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
    setMessage("Goodbye!")
    localStorage.removeItem("token")
    redirectToLogin()
  }

  const login = ({ username, password }) => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    axios.post(loginUrl, {username, password})
    .then(res => {
      // console.log(res)
      localStorage.setItem("token", res.data.token)
      setMessage(res.data.message)
      redirectToArticles()
      setSpinnerOn(false)
    })
    .catch(res => {
      console.log(res)
      setSpinnerOn(false)
    })

  }

  const getArticles = () => {
    // ✨ implement
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().get(articlesUrl)
    .then(res => {
      // console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      redirectToLogin()
      setMessage(err.response.data.message)
      setSpinnerOn(false)
    })
  }

  const postArticle = article => {
    // ✨ implement
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
    setMessage("")
    setSpinnerOn(true)
    axiosWithAuth().post(articlesUrl, article) /* expecting a title, text and a topic from article */
    .then(res => {
      // console.log(res)
      const newArticle = [...articles]
      if(res.data.article) {
        newArticle.push(res.data.article)
      }
      setArticles(newArticle)
      setMessage(res.data.message)
      setCurrentArticle(undefined)
      setCurrentArticleId(undefined)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  const updateArticle = (article_id, article) => {
    // ✨ implement
    // You got this!
    // console.log(article)
    // article.map()

    setSpinnerOn(true)
    axiosWithAuth().put(`http://localhost:9000/api/articles/${article_id}`, article)
    .then(res => {
      // console.log(res)
      const updatedArticle = []
      for (let i = 0; i < articles.length; i++) {
        if(articles[i].article_id === article.article_id) {
          updatedArticle.push(res.data.article)
        } else {
          updatedArticle.push(articles[i])
        }
      }
      setArticles(updatedArticle)
      setSpinnerOn(false)
      setMessage(res.data.message)
      setCurrentArticle(undefined)
      setCurrentArticleId(undefined)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  const deleteArticle = article_id => {
    // ✨ implement
    setSpinnerOn(true)
    axiosWithAuth().delete(`http://localhost:9000/api/articles/${article_id}`)
    .then(res => {
      // console.log(res)
      const deleteArticle = []
      for (let i = 0; i < articles.length; i++) {
        if(articles[i].article_id !== article_id) {
          deleteArticle.push(articles[i])
        }
      }
      setMessage(res.data.message)
      setArticles(deleteArticle)
      setSpinnerOn(false)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false)
    })
  }

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route path="articles" element={ !localStorage.getItem("token") ? <><ProtectedRoute /></> :
            <>
              <ArticleForm postArticle={postArticle} updateArticle={updateArticle} currentArticleId={currentArticleId} currentArticle={currentArticle} setCurrentArticle={setCurrentArticle} setCurrentArticleId={setCurrentArticleId} />
              <Articles getArticles={getArticles} articles={articles} deleteArticle={deleteArticle} setCurrentArticle={setCurrentArticle} currentArticleId={currentArticleId} setCurrentArticleId={setCurrentArticleId} />
            </>
           }/>
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
