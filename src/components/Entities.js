import React from 'react';
import CreateEntity from './CreateEntity';
import DisplayEntity from './DisplayEntity';
import CreateEntityButton from './UI/CreateEntityButton';
import Popup from './UI/Popup';
import { fields } from '../helpers';

import { AppContext } from './AppProvider';

const Entities = (props) => {
	const context = React.useContext(AppContext);

	/** Setting up the state **/
	const [state, setState] = React.useState({
		showPopup: false,
		reloadTable: false
	});

	/** Helper methods for hiding the showing the popup **/
	const hidePopup = () => setState({ 
		...state, 
		showPopup: false,
		reloadTable: true 
	});
    const showPopup = () => setState({ ...state, showPopup: true });
    
    const resetReloadTable = () => setState({ ...state, reloadTable: false });

	const entitiyFields = fields[props.entityName];

	/** Render Methods **/
	const renderPopup = () => {
		if (state.showPopup) {
			return (
				<Popup hidePopup={hidePopup}>
					<CreateEntity
						name=""
						stateName={props.entityName}
						fields={entitiyFields}
						addEntity={context.addEntity}
						isMulti={false}
						isDirect={true}
                        hidePopup={hidePopup}
                        entityLabel={props.entityLabel}
					/>
				</Popup>
			);
		}
	}

	return (
		<React.Fragment>
			{renderPopup()}
			<CreateEntityButton
				entity={props.entityLabel}
				showPopup={showPopup}
				injectIntoTable={true} />
			<DisplayEntity
				name={props.entityName}
                fields={entitiyFields}
                reloadTable={state.reloadTable}
                resetReloadTable={resetReloadTable}
                entityLabel={props.entityLabel}
			/>
		</React.Fragment>
	);
};

export default Entities;