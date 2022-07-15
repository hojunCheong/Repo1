import styles from './Main.module.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SERVER_URL_MAIN_PAGE = "http://localhost:3300/v1/chart/";

function Main() {
    const [category, setCategory] = useState('domestic');
    const [chartList, setChartList] = useState([]);
    const [time, setTime] = useState('');
    
    const searchRef = useRef('');

    const nv = useNavigate();
  
    // fetch. Main Page. chart list.
    const fetchData = async () => {
      try {
        console.log('Main Page, chart list fetching');
        console.log(SERVER_URL_MAIN_PAGE + category);
        const { data } = await axios.get(SERVER_URL_MAIN_PAGE + category);
        if(!data) return;
        setChartList(data.chartList);
      } catch(err) {
        console.log(`ERROR ::::: ${err}`);
      }
    }
  
    const setClock = () => {
      const date = new Date().toLocaleTimeString();
      return date;
    }
    
    // TODO infinity scroll 없는 케이스 useEffect
    // useEffect(() => {
    //   fetchData('domestic');
    //   setInterval(() => {setTime(setClock())}, 1000);
    // }, [category]);

    // TODO infinity scroll 있는 케이스 useEffect
    useEffect(() => {
      fetchData();
      setInterval(() => {setTime(setClock())}, 1000);
        // scroll event listener 등록
      window.addEventListener("scroll", handleScroll);
      return () => {
        // scroll event listener 해제
        window.removeEventListener("scroll", handleScroll);
      };
    }, [category]);

    // TODO [추가기능1] infinity scroll, 제거 할 때 케이스에 맞는 useEffect 로 변경 필요
    // 스크롤 이벤트 핸들러
    const fetchDataInfinityScroll = async () => {
      try {
        console.log('infinity scroll fetching');
        console.log(SERVER_URL_MAIN_PAGE + category);
        const { data } = await axios.get(SERVER_URL_MAIN_PAGE + category);
        if(!data) return;
        setChartList((prev) => [...prev, ...data.chartList]);
      } catch(err) {
        console.log(`ERROR ::::: ${err}`);
      }
    }

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = document.documentElement.scrollTop;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        // 페이지 끝에 도달하면 추가 데이터를 받아온다
        fetchDataInfinityScroll();
      }
    };
    // TODO [추가기능1] infinity scroll, 제거 할 때 케이스에 맞는 useEffect 로 변경 필요

    // TODO [추가기능2] 검색
    const searchTitle = () => {
      console.log('input value => ' + searchRef.current.value);
      const searchedList = chartList.filter((item) => {
        return item.title.toLowerCase().includes(searchRef.current.value);
      }); /* 소문자 조회 가능 / 대문자 조회 불가 */
      setChartList(searchedList);
    }

    const cancelSearch = () => {
      searchRef.current.value = '';
      fetchData();
    }

    const onKeyPress = (e) => {
      if(e.key === 'Enter') searchTitle();
    }

    const onChange = (e) => {
      if(e.target.value === "") cancelSearch();
    }
    // TODO [추가기능2] 검색

    // TODO [추가기능3] 정렬. ex) rank 값의 오름차순, 내림차순 정렬
    const sortAsc = () => {
      chartList.sort((a, b) => a.rank - b.rank);
    }

    const sortDesc = () => {
      chartList.sort((a, b) => b.rank - a.rank);
    }
    // TODO [추가기능3] 정렬. ex) rank 값의 오름차순, 내림차순 정렬

  
    return (
      <div className={styles.App}>
        <div className={styles.wrapper}>
          <span style={{ textAlign: "center" }}>
            음악차트
          </span>
          <span style={{ textAlign: "center" }}>
            {!time &&
              (
                <div>시간 설정 중...</div>
              )
            }
            {time &&
              (<div>{time}</div>)
            }
          </span>
          <div>
            <span className={styles.category} onClick={() => {setCategory('domestic')}}>국내</span>
            <span className={styles.category} onClick={() => {setCategory('overseas')}}>해외</span>
          </div>

          {/* 검색 */}
          <div>
            <input
            ref={searchRef}
            type="text"
            onKeyPress={onKeyPress}
            onChange={onChange}
            placeholder="제목검색" />
            <button onClick={searchTitle}>검색</button>
            <button onClick={cancelSearch}>검색취소</button>
          </div>

          {/* 정렬 */}
          <div>
            <button onClick={sortAsc}>정렬_오름차순</button>
            <button onClick={sortDesc}>정렬_내림차순</button>
          </div>

          <ul>
          {chartList.map((item, idx) => (
                <li key={idx} onClick={()=>{ nv(`/detail/${item.id}`) }}>
                  <div className={styles.contents}>
                    <span className={styles.num}>{item.rank}</span>
                    <img
                    className={styles.img}
                    art="img"
                    src={`/images/${item.imageUrl}`}/>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.singer}>{item.singer}</span>
                  </div>
                </li>
            )) 
            }
            {/* {chartList.map((item, idx) => (
                <li key={idx} onClick={()=>{ nv(`/detail/${item.id}`) }}>
                  <div className={styles.contents}>
                    <span className={styles.num}>{item.rank}</span>
                    <img
                    className={styles.img}
                    art="img"
                    src={`/images/${item.imageUrl}`}/>
                    <span className={styles.title}>{item.title}</span>
                    <span className={styles.singer}>{item.singer}</span>
                  </div>
                </li>
            )) 
            } */}
          </ul>
        </div>
        <button className={styles.gototop} onClick={()=> window.scrollTo(0, 0)}>맨 위로</button>
      </div>
    )
}

export default Main;