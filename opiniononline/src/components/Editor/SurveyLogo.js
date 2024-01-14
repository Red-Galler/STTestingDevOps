import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function SurveyLogo({ logo, surveyStyle }) {

    return (
        <div>
          

            {
                logo ? <div className={`flex justify-${surveyStyle.logoPosition}`}><img key={Date.now()} alt="Logo" src={logo} className={`h-${surveyStyle.logoSize} w-${surveyStyle.logoSize}`}></img></div>
                : null
            }

        </div>)
}



export default SurveyLogo;