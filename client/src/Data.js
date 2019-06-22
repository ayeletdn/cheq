import React from 'react';
import { NavLink, Route } from 'react-router-dom';
import DataTable from './components/datatable.js';

export default function Data({location}) {


    return (
        <div className="mdl-tabs mdl-js-tabs">
            {console.log(location.pathname)}
            <div className="mdl-tabs__tab-bar">
                <NavLink to="/data/vasts" className="mdl-tabs__tab" activeClassName="is-active">Vasts</NavLink>
                <NavLink to="/data/keywords" className="mdl-tabs__tab" activeClassName="is-active">Keywords</NavLink>
            </div>

            <Route path="/data/vasts" render={() => 
                <div className="mdl-tabs__panel is-active" id="vasts">
                    <DataTable type="vasts"/>
                </div>
            } />
            <Route path="/data/keywords" render={() => 
                <div className="mdl-tabs__panel is-active" id="keywords">
                    <DataTable type="keywords"/>
                </div>
            } />
        </div>        
    )
}