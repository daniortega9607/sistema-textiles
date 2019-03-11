import NumberFormatter from "./NumberFormatter";

const Currency = ({ props }) => (
    <div>{props.value ? '$'+NumberFormatter(props.value) : ''}</div>
  );
export default Currency;