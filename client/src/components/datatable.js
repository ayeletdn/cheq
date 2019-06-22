import React, { useState, useEffect } from 'react';
import db from './clientDB.js';
import NewRow from './newRow.js';
import './datatable.css';

const FIELD_INPUT_TYPES = {
    keywords: {id:"number",user_id:"number",name:"text",description:"text",keywords:"text",number_of_keywords:"number",language:"text",is_private:"number",last_modified:"datetime-local",origin_keywords:"text",version:"text",origin_version:"text"},
    vasts: {id:"number",name:"text",date_created:"datetime-local",description:"text",active:"number",continue_on_click:"number",language:"text",hide_timer:"number",timer_location:"text",skip_button_location:"text",hide_all_ui:"number",hide_play_button:"number",hide_skip_button:"number",fraud:"number",brand_safety:"number",network_id:"number",ad_tag_url:"text",width:"number",height:"number",duration:"number",whitelist_keywords:"text",serve_on_unmeasurable:"number",is_branded:"number",private_brand_safety:"number"}
}

function DataTable(props) {

    const [data, setData] = useState([]);
    const [headers, setHeaders] = useState([['id','number'], ['value', 'text']]);
    const [editId, setEditId] = useState(-1);
    const [editForm, setEditForm] = useState({});
    
    // Initial data load
    useEffect(() => {
        // parse headers
        const readHeaders = values => {
            if (!(values instanceof Array) || !values.length || values.length === 0) {
                return [];
            }

            return Object.keys(values[0]).map(h => [h, FIELD_INPUT_TYPES[props.type][h]]);
        }

        db.get(props.type)
        .then((value, reason) => {
            if (reason) {
                console.error("Could not get data from DB: " + reason);
                return;
            }
            setData(value);
            setHeaders(readHeaders(value));
        })
        .catch(reason => {
            console.log(`Could not load data: ${reason}`);
        })
    }, [props.type]);

    const toggleEdit = e => {
        const id = e && e.target ? parseInt(getParentId(e.target)) :editId;
        if (id) {
            if (id === editId) {
                setEditForm({});
                setEditId(-1);
            } else {
                const row = data.find(r => {return r.id === id;});
                setEditForm(row);
                setEditId(id);
            }
        }
    }

    const handleEditInput = e => {
        const value = e.target.value;
        const field = e.target.id.replace('edit_','');
        setEditForm(Object.assign({}, editForm, {[field]: value}));
    }

    const handleEditSave = e => {
        preSubmit();
        db.put(props.type, editForm)
        .then((response, reason) => {
            if (reason) {
                console.error("Could not save row changes");
                return;
            }
            // replace the row data
            const newData = data.map(r => {
                // response does not contain the ID :/
                if (r.id === editForm.id) {
                    return response;
                }
                return r;
            });
            setData(newData);
            toggleEdit();

        })
    }

    // Fix date-time for input field
    const cellValue = (value, type) => {
        if (value && type === 'datetime-local') {
            // add the T if missing
            // remove the 'Z' for Zulu
            // remove miliseconds (should always be .000?)
            return value
            .trim()
            .replace(' ', 'T')
            .replace('Z', '')
            .replace(/\.\d\d\d/, '');
        }
        return value;
    }

    // remove the T for submission
    const preSubmitDateFormat = value => value.replace('T',' ');

    // Fix date-time pre-submission
    const preSubmit = () => {
        Object.keys(editForm).forEach(k => {
            const value = editForm[k];
            const type = FIELD_INPUT_TYPES[props.type][k];
            if (type === 'datetime-local') {
                editForm[k] = preSubmitDateFormat(cellValue(value, type));
            }
        })
    }

    const handleDelete = e => {
        const id = getParentId(e.target);
        if (!window.confirm(`Are you sure you want to delete item with ID ${id}?`)) {
            return;
        }
        db.deleteRow(props.type, id)
        .then((response, reason) => {
            if (reason) {
                console.error(`Could not delete row id ${id}`);
                return;
            }
            spliceRow(response);
        });
    }

    const spliceRow = id => {
        const newData = data.filter(row => {
            return row.id !== parseInt(id);
        });
        setData(newData);
    }

    const appendRow = form => {
        setData(data.concat([form]));
    }

    const getParentId = element => {
        if (element.id) {
            return element.id;
        }
        if (!element.parentElement) {
            console.warn('no ID found');
            return undefined;
        }
        return getParentId(element.parentElement);
    } 

    return (
        <div className="dataTable">
            <NewRow headers={headers} type={props.type} appendRow={appendRow}/>
            <table className="mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                <thead>
                    <tr>
                        {headers.map(([header, type], i) => 
                            <th key={i}>{header}</th>
                        )}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, i) => 
                        <tr key={row.id} id={row.id}>
                            {headers.map(([h, t], j) => 
                                row.id === editId ?
                                <td key={j}>
                                    <input type={t} value={cellValue(editForm[h], t) || ""} onChange={handleEditInput} id={'edit_'+ h}/>
                                </td>
                                :
                                <td key={j}>{row[h]}</td>
                            )}
                            <td>
                                {
                                    row.id === editId ?
                                    <div>
                                        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={handleEditSave}>Save</button>
                                        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={toggleEdit}>Cancel</button>
                                    </div>
                                    :
                                    <div>
                                        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={toggleEdit}>edit</button>
                                        <button className="mdl-button mdl-js-button mdl-button--raised" onClick={handleDelete}>delete</button>    
                                    </div>
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default DataTable;