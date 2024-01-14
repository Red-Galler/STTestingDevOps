import { Checkbox } from "@material-tailwind/react";
import { useEffect, useState } from "react";

function CheckboxGroup({ answers, onChange, responses = [], color }) {

    const [selectedOptions, setSelectedOptions] = useState(responses);


    function HandleChange(option) {

        setSelectedOptions(prev => {
            if (prev.includes(option)) {
                prev = prev.filter(respons => respons.id !== option.id)
                return [...prev]
            }

            return [...prev, option]
        });
    }


    useEffect(() => {

        onChange(selectedOptions);


    }, [selectedOptions])


    return (
        <div className="flex flex-col">
            {
                answers.map((answer) => {
                    return <Checkbox labelProps={{
                        style: { color: color },
                    }} checked={selectedOptions?.includes(answer)} name="answer" label={answer.answerContent} color="green" key={answer.id} onChange={() => { HandleChange(answer) }} />
                })
            }
        </div>
    );
}



export default CheckboxGroup;