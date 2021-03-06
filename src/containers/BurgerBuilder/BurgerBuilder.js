import React, { Component } from 'react';
import Aux from '../../hoc/Aux/Aux';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/BuildControls/BuildControls';
import Modal from '../../UI/Modal/Modal';
import OrderSummary from '../../components/OrderSummary/OrderSummary';
import Spinner from '../../UI/Spinner/Spinner';
import WithErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import axios from '../../axios-orders';
import { connect } from 'react-redux';
import * as actionCreatorBurgerBuilder from '../../store/actions/BurgerBuilderActions';
class BurgerBuilder extends Component {
  state = {
    purchasing: false,
    loading: false
  }
  componentDidMount() {
    this.props.onFetchIngrediens();
  }
  updatePurchaseableState = (ingredients) => {
    let count = 0;
    for (var key in ingredients) {
      count = count + ingredients[key];
    }
    if (count > 0) {
      return true;
    } else {
      return false;
    }
  }
  purchaseHandler = () => {
    if (this.props.isAuth) {
      this.setState({ purchasing: true }); 
    } else {
      this.props.history.push('/auth');
    }
  }
  cancelpurchaseHandler = () => {
    this.setState({ purchasing: false });
  }
  continuePurchaseHandler = () => {
    this.props.history.push('/checkout');
  }
  render() {
    const disabledInfo = {
      ...this.props.ingredients
    }
    for (let key in disabledInfo) {
      disabledInfo[key] = disabledInfo[key] <= 0
    }
    let order_summary = null;
    let burger = <Spinner />
    if (this.props.ingredients) {
      let check = this.updatePurchaseableState(this.props.ingredients);
      burger = (
        <Aux>
          <Burger ingredients={this.props.ingredients}></Burger>
          <BuildControls
            purchasing={this.purchaseHandler}
            purchaseable={check}
            price={this.props.totalPrice}
            disabled={disabledInfo}
            addIngredient={this.props.onIngredientAdded}
            removeIngredient={this.props.onIngredientRemoved}
            auth={this.props.isAuth}>
          </BuildControls>
        </Aux>
      );
      order_summary = <OrderSummary
        puchaseCancelled={this.cancelpurchaseHandler}
        purchaseContinue={this.continuePurchaseHandler}
        ingredients={this.props.ingredients}
        price={this.props.totalPrice}
      />;
    }
    if (this.state.loading) {
      order_summary = <Spinner />;
    }
    return (
      <Aux>
        <Modal cancelled={this.cancelpurchaseHandler} show={this.state.purchasing}>
          {order_summary}
        </Modal>
        {burger}
      </Aux>
    );
  }
}
const mapStateToProps = state => {
  return {
    ingredients: state.brgbuilder.ingredients,
    totalPrice: state.brgbuilder.totalPrice,
    isAuth: state.auth.token !== null
  }
}
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: (ingName) => dispatch(actionCreatorBurgerBuilder.addIngredients(ingName)),
    onIngredientRemoved: (ingName) => dispatch(actionCreatorBurgerBuilder.removeIngredients(ingName)),
    onFetchIngrediens: () => dispatch(actionCreatorBurgerBuilder.fetchIngredients())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithErrorHandler(BurgerBuilder, axios));