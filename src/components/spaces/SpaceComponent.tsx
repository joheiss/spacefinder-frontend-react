import React from "react";
import './SpaceComponent.css';

interface SpaceComponentProps {
    id: string;
    name: string;
    location: string;
    photoUrl?: string;
    reserveSpace: (id: string) => void;
}

export class SpaceComponent extends React.Component<SpaceComponentProps> {

    render() {
        return(
            <div className='spaceComponent'>
                {this.renderImage()}
                <label className='name'>{this.props.name}</label><br/>
                <label className='id'>{this.props.id}</label><br/>
                <label className='location'>{this.props.location}</label><br/>
                <button onClick={() => this.props.reserveSpace(this.props.id)}>Reserve</button>
            </div>
        );
    }

    private renderImage(): any {
        if (this.props.photoUrl) {
            return (<img src={this.props.photoUrl} alt='' />);
        } else {
            return (<img src='/images/generic-image.jpeg' alt='' />);
        }
    }

}