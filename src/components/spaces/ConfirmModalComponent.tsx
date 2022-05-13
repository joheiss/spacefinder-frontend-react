import React from "react";
import './ConfirmModalComponent.css';

interface ConfirmModalComponentProps {
    visible: boolean;
    content: string;
    close: () => void;
}

export class ConfirmModalComponent extends React.Component<ConfirmModalComponentProps> {

    render(): any {
        if (!this.props.visible) return null;
        return (
            <div className='modal'>
                <div className='modal-content'>
                    <h2>Make a reservation</h2>
                    <h3 className='modalText'>{this.props.content}</h3>
                    <button onClick={() => this.props.close()}>OK</button>
                </div>
            </div>
        );
    }
}