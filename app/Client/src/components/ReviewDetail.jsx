import React, { useEffect, useRef, useState } from 'react'
import './css/review-detail.css'
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Portal from './modal/Portal';
import Modal from './modal/Modal';

export default function ReviewDetail() {
  const location = useLocation()
  const nav = useNavigate()
  const {id} = useParams()
  
  const commentInputRef = useRef([])
  const [isCommentLoading, setIsCommentLoading] = useState(false)
  const [commentList, setCommentList] = useState(null)
  const [reviewList,setReviewList] = useState(null)
  
  useEffect(() => {
    axios.get(`/reviewList/${id}`).then((data)=>(setReviewList(data.data)))
    axios.get(`/comment/${id}`).then((comment)=>setCommentList(comment.data))
  },[id])
  
  if(!location.state && !reviewList){
    return <div>Loading....</div>
  }

  const reviewInfo = location.state ? location.state.reviewInfo : reviewList[0]

  const clickEditBtn = async() => {
    nav(`/review/edit/${id}`, {state:{title:reviewInfo.title, content:reviewInfo.content}})
  }

  const clickDelBtn = async() => {
    const confirm = window.confirm('삭제하시겠습니까?')
    if(!confirm) return
    const body = {idx : id}
    setIsCommentLoading(true)
    const response = await axios.delete('/reviewList',{data:body})
    if(response.data.success){
      alert(response.data.msg)
      nav('/review')
    }
    else alert(response.data.msg)
    setIsCommentLoading(false)
  }
  
  // 글쓰기 누를떄
  const clickWriteBtn = async() => {
    setIsCommentLoading(true)
    const response = await axios.get('/check-auth')
    if(response.data.success) nav('/review/write')
    else if(sessionStorage.getItem('userId') && !response.data.success){
      sessionStorage.clear()
      alert('세션이 만료되었습니다.')
      window.location.reload()
    }
    else{
      const move = window.confirm(response.data.msg)
      if(move) nav('/login')
    }
    setIsCommentLoading(false)
  }
  
  // 댓글달 때
  const submitComment = async(e) => {
    e.preventDefault()
    const writer = commentInputRef.current[0].value
    const pw = commentInputRef.current[1].value
    const comment = commentInputRef.current[2].value
    const postIdx = reviewInfo.idx
    if(!writer) return alert('닉네임을 입력해주세요.')
    if(writer.length > 15) return alert('닉네임은 15자까지 가능합니다.')
    if(!pw) return alert('비밀번호를 입력해주세요.')
    if(!comment) return alert('내용을 입력해주세요.')
    const body = {writer:writer, pw:pw, comment:comment, postIdx: postIdx}
    setIsCommentLoading(true)
    const response = await axios.post('/reviewWriteComment', body)
    setIsCommentLoading(false)
    if(response.data.success){
      setCommentList([...commentList,response.data.info])
      commentInputRef.current[1].value = ''
      commentInputRef.current[2].value = ''
    }
    else alert(response.data.msg)
  }
  
  // 데이터 fetch 속도를 줄이기 위해 프론트 단은 filter로 구현, 백엔드쪽은 따로 삭제,추가 진행
  // 추가할때 넣어준 date,writer,comment의 값으로 받아와서 삭제 진행
  const clickDelComment = async(comment) => {
    const selComment = commentList.filter((data)=>(data.date === comment.date))
    const checkPw = window.prompt('비밀번호를 입력하세요.')
    if(!checkPw) return
    if(checkPw !== selComment[0].pw) return alert('비밀번호가 다릅니다.')
    setIsCommentLoading(true)
    const body = {date : comment.date, writer : comment.writer, comment: comment.comment}
    const response = await axios.delete(`/delComment`,{data:body})
    setIsCommentLoading(false)
    if(response.data.success){
      setCommentList(commentList.filter((data)=>(
        !((data.date === comment.date) && 
        (data.writer === comment.writer) && 
        (data.comment === comment.comment))
        )))
    }
    else alert(response.data.msg)
  }

  return (
    <div className='review-detail-wrap'>
      {isCommentLoading &&
        <Portal>
          <Modal isCommentLoading={isCommentLoading}/>
        </Portal>}
      <header className='review-detail-header'>
        <div className='review-detail-category'>
          <div className="header-category">
            <span>{reviewInfo.category}</span>
          </div>
          <div className="edit-review">
            <span onClick={clickEditBtn}
              style={{
                visibility:(sessionStorage.getItem('userId') === reviewInfo.writer) ? 'visible' : 'hidden'
            }}>
              수정
            </span>
            <span onClick={clickDelBtn} 
              style={{
                visibility:(sessionStorage.getItem('userId') === reviewInfo.writer) ? 'visible' : 'hidden'
            }}>
              삭제
            </span>
            <span onClick={clickWriteBtn}>글쓰기</span>
          </div>
        </div>
        <div className='review-detail-title'>
          <span>{reviewInfo.title}</span>
        </div>
        <div className='review-detail-writer-info'>
          <div className='review-detail-writer'>
            <span>{reviewInfo.writer}</span>
            <span>{reviewInfo.date.slice(0,19)}</span>
          </div>
          <div className='review-detail-time'>
            <span>조회 {reviewInfo.count}</span>
          </div>
        </div>
      </header>
      <textarea className='review-detail-content' disabled={true} value={reviewInfo.content}></textarea>
      <footer className='comment-wrap'>
        <div className='comment-header'>
          <span>전체 댓글</span>
          <span>{commentList ? commentList.length : '??'}</span>
          <span>개</span>
        </div>
        <div className='comment-box'>
          {commentList ?
            commentList.map((commentInfo,idx)=>(              
              <div key={idx} className="comment-list">
                <span>
                  {commentInfo.writer.includes('익명') ?
                  <>
                    <span>{commentInfo.writer.slice(0,2)}</span><span style={{fontSize:'.6rem',marginBottom:'-8px',color:'gray'}}>{commentInfo.writer.slice(2,9)}.**</span>
                  </>
                      :
                    <span>{commentInfo.writer}</span>
                  }
                </span>
                <span>{commentInfo.comment}</span>
                <span>{window.innerWidth < 540 ?commentInfo.date.slice(11) : commentInfo.date}</span>
                <span onClick={()=>clickDelComment(commentInfo)}>x</span>
              </div>              
            ))              
          :
          <div>Loading...</div>}
        </div>
        <form className='comment-submit-form' onSubmit={(e)=>(submitComment(e))}>
          <div className='make-comment'>
            {sessionStorage.getItem('userId') ?
            <>
              <div className='make-comment-userinfo'>
                <div className='userinfo-input'>
                  <input type="text" value={sessionStorage.getItem('userId')} disabled={true} ref={el=>commentInputRef.current[0] = el}/>
                  <input type="password" placeholder='비밀번호' ref={el=>commentInputRef.current[1] = el}/>
                </div>
              </div>
            </>
              :
            <>
              <div className='make-comment-userinfo'>
                <div className='userinfo-input'>
                  <input type="text" placeholder='닉네임' value={'익명'} disabled={true} ref={el=>commentInputRef.current[0] = el}/>
                  <input type="password" placeholder='비밀번호' ref={el=>commentInputRef.current[1] = el}/>
                </div>
              </div>
            </>
            }
            <div className='make-comment-input'>
              <textarea className='comment-input' maxLength={100}
              placeholder=
              '타인의 권리를 침해하거나 명예를 훼손하는 댓글은 운영원칙 및 관련 법률에 제제를 받을 수 있습니다.'
              cols="30" rows="10" ref={el=>commentInputRef.current[2] = el}>
              </textarea>
            </div>
          </div>
          <div className='comment-submit-button'>
            <button>등록</button>
          </div>
        </form>
      </footer>
    </div>
  )
}
