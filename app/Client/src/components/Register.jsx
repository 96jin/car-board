import React, { useState } from 'react'
import './css/register.css'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Portal from './modal/Portal';
import Modal from './modal/Modal';

export default function Register() {
  const nav = useNavigate()
  const [registerName, setRegisterName] = useState('')
  const [registerId, setRegisterId] = useState('')
  const [registerPw, setRegisterPw] = useState('')
  const [registerPwConfirm, setRegisterPwConfirm] = useState('')
  const [regPwVisible, setRegPwVisible] = useState(false)
  const [isShowModal, setIsShowModal] = useState(false)

  const registerPwIsVisible = () => {
    setRegPwVisible(!regPwVisible)
  }

  const handleSignUpSubmit = async(e) => {
    e.preventDefault()
    if(!registerName) return alert('성함을 입력해주세요.')
    if(!registerId) return alert('아이디를 입력해주세요.')
    if(!registerPw) return alert('비밀번호를 입력해주세요')
    if(registerPw !== registerPwConfirm) return alert('비밀번호가 일치하지 않습니다.')
    setIsShowModal(true)
    const response = await axios.post('/register', {id:registerId, pw:registerPw, name:registerName})
    setIsShowModal(false)
    if(!response.data.success) return alert(response.data.msg)
    if(response.data.success){
      alert('회원가입 완료!')
      return nav('/login')
    } 
  }
  const warningPw = Boolean(registerPw !== registerPwConfirm)

  return (
    <div className='register-wrap'>
      {isShowModal && 
      <Portal>
        <Modal isShowModal={isShowModal}/>
      </Portal>}
      <div className='register-input-box'>
        <form className='register-info' onSubmit={handleSignUpSubmit}>
          <input type="text" placeholder='성함을 입력해주세요.' onChange={e=>setRegisterName(e.target.value)}/><br />
          <input type="text" placeholder='아이디를 입력해주세요.'onChange={e=>setRegisterId(e.target.value)}/><br />
          <span className='register-pw-input-box'>
            <input type={regPwVisible ? "text" : "password"} placeholder='비밀번호 입력해주세요.' onChange={e=>setRegisterPw(e.target.value)}/>
            <img className='register-pw-isvisible' src={regPwVisible ? "./img/visible.png" : "./img/unvisible.png"} alt="" onClick={registerPwIsVisible}/>
            <br />
          </span>
          <input type={regPwVisible ? "text" : "password"} placeholder='비밀번호 확인.' onChange={e=>setRegisterPwConfirm(e.target.value)}/>
          <br />
          <div className='register-warn-pw' style={{display: 'block'}}>
            <span style={{margin:'0 auto', display:'block', color:warningPw ? 'red' : 'green'}}>
              {!registerPwConfirm ? '' : warningPw? '*비밀번호가 일치하지 않습니다.' : '*비밀번호가 일치합니다.'}
            </span>
          </div>
          <button>SIGN UP</button>
        </form>
        <span>이미 회원이신가요? <span><Link to='/login'>로그인</Link></span></span>
      </div>
    </div>
  )
}
