import React from "react";
import {container, input, underline} from "./textFilter.css";

const TextFilter = ({name, placeholder, required, onChange}) =>
	<div className={container}>
		<input id="name"
			className={input}
			type="text"
			value={name}
			placeholder={placeholder}
			onChange={onChange}
			required={required}/>
		<hr className={underline}/>
	</div>

TextFilter.propTypes = {
	name:        React.PropTypes.string.isRequired,
	placeholder: React.PropTypes.string,
	required:    React.PropTypes.bool,
	onChange:    React.PropTypes.func.isRequired
};

TextFilter.defaultProps = {
	placeholder: 	"",
	required: 		false
}

export default TextFilter;
