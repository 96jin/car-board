import axios from 'axios'
import React, { useRef, useState } from 'react'
import './css/review-write.css'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Portal from './modal/Portal';
import Modal from './modal/Modal';

export default function ReviewWrite() {
  const category = useRef()
  const arrowRef = useRef()
  const reviewContentRef = useRef()
  const categoryRef = useRef([])
  const [isWriteLoading, setIsWriteLoading] = useState(false)
  const [selectCategory, setSelectCategory] = useState('카테고리')
  const [reviewTitle, setReviewTitle] = useState('')
  const [writeCount, setWriteCount] = useState('')
  
  const params = useParams()
  console.log(useLocation())

  const nav = useNavigate()
  if(!sessionStorage.getItem('userId')){
    window.location.href = ('/login')
  }

  // 카테고리 클릭시 반응
  const clickCategory = () => {
    category.current.classList.contains('category-clicked') ? 
    category.current.className = 'category-selected' :
    category.current.className = 'category-clicked'
    arrowRef.current.classList.contains('img-clicked') ?
    arrowRef.current.className = 'img-selected' :
    arrowRef.current.className = 'img-clicked'
  }
  const clickCategoryList = (e) => {
    if(e.target.textContent === '공지사항'){
      if(sessionStorage.getItem('userId') !== 'admin'){
        alert('공지사항은 관리자만 등록가능합니다.')
        return
      }
    }
    [categoryRef.current[0].textContent, e.target.textContent] = [e.target.textContent, categoryRef.current[0].textContent]
    setSelectCategory(categoryRef.current[0].textContent)
    // category.current.stylt.height = '20px'
  }
  
  const submitReview = async(e) => {
    e.preventDefault()
    if(selectCategory === '카테고리') return alert('카테고리를 선택해주세요.')
    if(!reviewTitle) return alert('제목을 입력해주세요.')
    if(!reviewContentRef.current.value) return alert('내용을 입력해주세요.')
    if(writeCount.length>1000) return alert('1000자를 초과했습니다.')
    const body = {category:selectCategory, title:reviewTitle, content:reviewContentRef.current.value,idx:0}
    setIsWriteLoading(true)
    const response = !params.idx ? 
      await axios.post('/reviewWrite',body) : 
      await axios.put('/reviewEdit',{...body, idx:params.idx})
    if(response.data.success){
      alert(response.data.msg)
      nav('/review') 
    }
    else alert(response.data.msg)
    setIsWriteLoading(true)
  }

  return (
    <div className='review-write-wrap'>
      {isWriteLoading &&
        <Portal>
          <Modal isWriteLoading={isWriteLoading} />
        </Portal>
      }
      <div className='review-write-form-box'>
        <form className='review-write-form' onSubmit={submitReview}>
          <div className='write'>
            <span>{params.idx ? '글 수정' : '글 쓰기'}</span>
          <button>{params.idx ? '수정' : '작성'}</button>
          </div>
          <div className='review-write-title'>
            <div className='review-write-category' onClick={clickCategory}>
              <ul ref={category}>
                <li ref={el=>categoryRef.current[0] = el} onClick={(e)=>clickCategoryList(e)}>카테고리</li>
                <li ref={el=>categoryRef.current[1] = el} onClick={(e)=>clickCategoryList(e)}>공지사항</li>
                <li ref={el=>categoryRef.current[2] = el} onClick={(e)=>clickCategoryList(e)}>일반</li>
                <li ref={el=>categoryRef.current[3] = el} onClick={(e)=>clickCategoryList(e)}>후기</li>
              </ul>
              <img className='img-selected' src="/img/arrow.svg" alt="화살표" ref={arrowRef} />
            </div>
            <input type="text" placeholder='제목을 입력해주세요.' onChange={(e)=>setReviewTitle(e.target.value)}/>
          </div>
          <div className='write-count'>
            <span>{writeCount.length}/1000</span>
          </div>
          <div>
            <textarea className='review-write-content' 
              placeholder='내용을 입력해주세요.' 
              maxLength={1000} cols="30" rows="10" ref={reviewContentRef} 
              onChange={(e)=>setWriteCount(e.target.value)}>              
            </textarea>
          </div>
        </form>
      </div>
    </div>
  )
}
