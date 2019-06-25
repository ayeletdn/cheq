import React, { useState } from 'react';
import db from './clientDB.js';
import './newRow.css';

const FIELD_INPUT_TYPES = {
    keywords: {id:"number",user_id:"number",name:"text",description:"text",keywords:"text",number_of_keywords:"number",language:"text",is_private:"number",last_modified:"date",origin_keywords:"text",version:"text",origin_version:"text"},
    vasts: {id:"number",name:"text",date_created:"date",description:"text",active:"number",continue_on_click:"number",language:"text",hide_timer:"number",timer_location:"text",skip_button_location:"text",hide_all_ui:"number",hide_play_button:"number",hide_skip_button:"number",fraud:"number",brand_safety:"number",network_id:"number",ad_tag_url:"text",width:"number",height:"number",duration:"number",whitelist_keywords:"text",serve_on_unmeasurable:"number",is_branded:"number",private_brand_safety:"number"}
}

function NewRow(props) {

    const [edit, setEdit] = useState(false);
    const [form, setFormValue] = useState({});

    const toggleCreate = () => {
        setEdit(!edit);
    }

    const inputChange = (e) => {
        const value = e.target.value;
        const field = e.target.id;
        setFormValue(Object.assign({}, form, {[field]: value}));
    }

    const handleCreate = (e) => {
        db.post(props.type, form)
        .then((response, reason) => {
            if (reason) {
                console.error("Could not create row");
                return;
            }
            // append the new row
            props.appendRow(response);
            // clear the form
            setFormValue({});
            // hide the form
            toggleCreate();

        })
        e.preventDefault(); // prevent UI from refreshing
    }

    // TODO: improve form validation
    // TODO: fix UI for data field
    return (
        <div>
            <div className="commandsRow">
                <button className="mdl-button mdl-js-button mdl-button--raised" onClick={toggleCreate}>Add new row</button>
            </div>
            <form className={edit ? '' : 'hidden'}>
                {props.headers
                .filter(h => {return h !== "id"})
                .map((header, i) => 
                    <div className="mdl-textfield mdl-js-textfield" key={header}>
                        <input className="mdl-textfield__input" type={FIELD_INPUT_TYPES[props.type][header]} onChange={inputChange} id={header} required/>
                        <label className="mdl-textfield__label" htmlFor={i}>{header}</label>                        
                    </div>
                )}
                <input type="submit" className="mdl-button mdl-js-button mdl-button--raised" onClick={handleCreate} value="Submit"/>
            </form>
        </div>
    )
}

export default NewRow;
export { FIELD_INPUT_TYPES };