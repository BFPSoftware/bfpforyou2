"use client";
import React from "react";
import "./style.css";

const Page = () => {
    return (
        <>
            <div className="holder">
                <img src="https://www.bridgesforpeace.com/wp-content/themes/bridges4peace/images/logo.jpg" style={{ width: "200px" }} />
                <h3>
                    <span className="tbl">BFP For You is currently under maintenance while we complete a major system upgrade</span>
                </h3>
                <p>
                    <span className="tbl">Please try again in a few days.</span>
                </p>
                <br />
                <br />
                <h3>
                    <span className="tbl">BFP For You נמצאת כעת בתחזוקה בזמן שאנו משלימים שדרוג מערכת גדול</span>
                </h3>
                <p>
                    <span className="tbl">אנא נסה שוב בעוד מספר ימים.</span>
                </p>
                <br />
                <br />
                <h3>
                    <span className="tbl">BFP For You в настоящее время находится на техническом обслуживании, пока мы завершаем масштабное обновление системы.</span>
                </h3>
                <p>
                    <span className="tbl">Пожалуйста, попробуйте еще раз через несколько дней.</span>
                </p>
                <br />
                <br />
            </div>
        </>
    );
};

export default Page;
