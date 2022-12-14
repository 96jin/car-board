import React, { useEffect, useState } from 'react'
import './css/footer.css'

export default function Footer({buttonLen,pageNum,setPageNum}) {
  const btnArr = []
  const [pageNumLength, setPageNumLength] = useState(10)
  let i = 1;
  while(i<=buttonLen){
    btnArr.push(i)
    i++
  }
  // 새로고침시 현재위치를 기억하여 그 자리를 유지
  window.history.scrollRestoration = "auto";

  const handlePrev = () => {
    setPageNum(pageNum - 1)
  }

  const handleMorePrev = () => {
    if(pageNum<=pageNumLength) return setPageNum(1)
    setPageNum(Math.ceil(pageNum/pageNumLength)*pageNumLength-(pageNumLength))
  }

  const handleNext = () => {
    setPageNum(pageNum + 1)
  }

  const handleMoreNext = () => {
    if(Math.ceil(buttonLen/pageNumLength) === Math.ceil(pageNum/pageNumLength)){
      setPageNum(buttonLen)
      return
    }
    if(pageNum === pageNumLength * Math.floor(pageNum/pageNumLength)){
      setPageNum(pageNum + 1)
      return
    }
    setPageNum(Math.floor(pageNum/pageNumLength)*pageNumLength+(pageNumLength+1))
  }

  useEffect(() => {
    window.scrollTo({top:0,left: 0,behavior:'smooth'})
    // window 의 너비값 변경 감지
    window.innerWidth < 540 ? setPageNumLength(3) : setPageNumLength(10)
  },[pageNum])

  return (
    <div className='footer'>
      <div className='page-info'>
        <span>{pageNum} page / {buttonLen} page</span>
      </div>
      <div className='btn-total-box' style={{width: window.innerWidth < 540 ? 330 : 450}}>
        <button className='btn-list' onClick={handleMorePrev} disabled={pageNum === 1} 
        style={{
          cursor: pageNum === 1 ? 'default' : undefined 
        }}
        >
          {'<<'}
        </button>
        <button className='btn-list' onClick={handlePrev} disabled={pageNum === 1}
        style={{
          cursor:(pageNum === 1 ? 'default' : undefined )
        }}
        >
          {'<'}
        </button>
        <div className='btn-list-box' style={{width:30*pageNumLength}}>
        {btnArr.map((num) => {
          return (
            <button key={num}  style={{
              transform:`translateY(-${30 * Math.floor((pageNum-1)/pageNumLength)}px)`,
            }}
            className={(pageNum === num) ? 'btn-list clicked':'btn-list'} 
            onClick={()=>setPageNum(num)} 
            >
              {num}
            </button>
          )
        })}
        </div>
        <button className='btn-list' onClick={handleNext} disabled={pageNum === buttonLen} 
        style={{
          cursor : (pageNum === buttonLen) ? 'default' : undefined
        }}
        >
          {'>'}
        </button>
        <button onClick={handleMoreNext} className='btn-list' disabled = {pageNum>=buttonLen}
        style={{
          cursor : (pageNum >= buttonLen) ? 'default' : undefined
        }}
        >
          {'>>'}
        </button>
      </div>
    </div>
  )
}
