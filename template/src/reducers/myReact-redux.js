import React, { Component, createElement, Children } from "react";
//import PropTypes from "prop-types";
const storeContext = React.createContext();

class Provider extends Component {
    static contextType = storeContext;
    render() {
        return (
            <storeContext.Provider value={{ store: this.props.store }}>
                {this.props.children}
            </storeContext.Provider>
        );
    }
}
const connect = (mapReducer = s => {}) => Com => {
    class Wrap extends Component {
        static contextType = storeContext;
        constructor(props, context) {
            super();
            this.store = context.store;
            this.state = { ...mapReducer(this.store.getState()) };
        }
        componentWillMount() {
            this.unsubscribe = this.store.subscribe(() => {
                this.setState({ ...mapReducer(this.store.getState()) });
            });
        }

        componentWillUnmount() {
            this.unsubscribe();
        }
        equal(obj1, obj2) {
            if (obj1 === obj2) return true;
            let obj1Name = Object.getOwnPropertyNames(obj1);
            let obj2Name = Object.getOwnPropertyNames(obj2);
            if (obj1Name.length != obj2Name.length) return false;
            for (let i = 0; i < obj1Name.length; i++) {
                var propName = obj1Name[i];
                if (obj1[propName] !== obj2[propName]) {
                    return false;
                }
            }
        }
        shouldComponentUpdate(nextProps, nextState) {
            return (
                !this.equal(nextState, this.state) ||
                !this.equal(nextProps, this.props)
            );
        }
        render() {
            return (
                <Com
                    {...this.state}
                    {...this.props}
                    dispatch={this.store.dispatch}
                />
            );
        }
    }
    return Wrap;
};

export { Provider, connect };
