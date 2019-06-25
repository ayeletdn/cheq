import React from 'react';
import { configure, shallow } from 'enzyme';
import { expect } from 'chai';
import DataTable from './datatable';

import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });

describe('Render component', () => {
    it('renders the button', () => {
        const wrapper = shallow(<DataTable type="vasts"/>);
        expect(wrapper.find('div.dataTable')).to.have.lengthOf(1);
    });
});