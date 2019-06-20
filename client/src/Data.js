import React from 'react';
import DataTable from './components/datatable.js';

function Data() {

    return (
        <div className="mdl-tabs mdl-js-tabs">
            <div className="mdl-tabs__tab-bar">
                <a href="#vasts" className="mdl-tabs__tab is-active">Vasts</a>
                <a href="#keywords" className="mdl-tabs__tab">Keywords</a>
            </div>

            <div className="mdl-tabs__panel is-active" id="vasts">
                <DataTable type="vasts"/>
            </div>
            <div className="mdl-tabs__panel" id="keywords">
                <DataTable type="keywords"/>
            </div>
        </div>
    )
}

export default Data