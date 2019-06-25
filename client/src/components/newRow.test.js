import React from 'react';
import { configure, shallow } from 'enzyme';
import { expect } from 'chai';
import NewRow from './newRow';

import Adapter from 'enzyme-adapter-react-16'
configure({ adapter: new Adapter() });

describe('Render component', () => {
    it('renders the button', () => {
        const wrapper = shallow(<NewRow headers={[]}/>);
        expect(wrapper.find('button')).to.have.lengthOf(1);
        expect(wrapper.find('button').last().contains('Add new row')).to.equal(true);
    });

    it('has a hidden form', () => {
        const wrapper = shallow(<NewRow headers={[]}/>);
        expect(wrapper.find('form.hidden')).to.have.lengthOf(1);
    });

    it('toggles the class when clicking the button', () => {
        const wrapper = shallow(<NewRow headers={[]}/>);
        wrapper
        .find("button")
        .last()
        .simulate("click");
        expect(wrapper.find('form').hasClass('hidden')).to.equal(false);
        wrapper
        .find("button")
        .last()
        .simulate("click");
        expect(wrapper.find('form').hasClass('hidden')).to.equal(true);
    });
});

describe('Render headers', () => {
    it('renders all headers', () => {
        let headers = ['name', 'value'];
        const wrapper = shallow(<NewRow headers={headers} type="keywords"/>);
        expect(wrapper.find('label')).to.have.lengthOf(headers.length);
        expect(wrapper.find('label').map(node => node.text())).to.eql(['name','value']);
    });

    it('doesn\'t render the id header', () => {
        let headers = ['id', 'value'];
        const wrapper = shallow(<NewRow headers={headers} type="keywords"/>);
        expect(wrapper.find('label')).to.have.lengthOf(headers.length-1);
        expect(wrapper.find('label').map(node => node.text())).to.eql(['value']);
    });
});

describe('Inputs', () => {
    it('updates the form when an input gets content', () => {
        let headers=['name'];
        const wrapper = shallow(<NewRow headers={headers} type="keywords"/>);
        wrapper.find('input').last().simulate('change', {target: {value: 'text', id: name}});
        // how to assert state??
    });
});