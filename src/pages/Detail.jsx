import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./Detail.module.css";

const SERVER_URL_DETAIL_PAGE = "http://localhost:3300/v1/chart/detail/";

function Detail() {
  const [detail, setDetail] = useState();

  const nv = useNavigate();
  const param = useParams();

  const fetchData = async () => {
    try {
      const { data } = await axios.get(SERVER_URL_DETAIL_PAGE + param.id);
      if (!data) return;
      setDetail(data.chart);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("PARAM :::");
    console.log(param);
    fetchData();
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.contents}>
        {detail && (
          <>
            <button
              onClick={() => {
                nv(`/`);
              }}
            >
              뒤로가기
            </button>
            <div className={styles.details}>
              <div className={styles.title}>
                <div>제목</div>
                <div>{detail.title}</div>
              </div>
              <div className={styles.singer}>
                <div>가수</div>
                <div>{detail.singer}</div>
              </div>
              <div className={styles.melodizer}>
                <div>작곡</div>
                <div>{detail.melodizer}</div>
              </div>
              <div className={styles.lyricist}>
                <div>작사</div>
                <div>{detail.lyricist}</div>
              </div>
              <div className={styles.genre}>
                <div>장르</div>
                <div>{detail.genre}</div>
              </div>
            </div>
          </>
        )}
        {!detail && <div>로딩 중....</div>}
      </div>
    </div>
  );
}

export default Detail;
