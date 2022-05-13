import React from "react";
import { Link } from "react-router-dom";
import { Space } from "../../model/Model";
import { DataService } from "../../services/DataService";
import { ConfirmModalComponent } from "./ConfirmModalComponent";
import { SpaceComponent } from "./SpaceComponent";

interface SpacesProps {
    dataService: DataService;
}

interface SpacesState {
    spaces: Space[];
    showModal: boolean;
    modalContent: string;
}

export class Spaces extends React.Component<SpacesProps, SpacesState> {

    constructor(props: SpacesProps) {
        super(props);
        this.state = { spaces: [], showModal: false, modalContent: '' };
        this.reserveSpace = this.reserveSpace.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    render(): any {
        return (
            <div>
                <h2>Welcome to Spaces!</h2>
                <div>
                    <Link to="/create-space">Create Space</Link>
                </div>
                {this.renderSpaces()}
                <ConfirmModalComponent 
                    visible={this.state.showModal} 
                    content={this.state.modalContent}
                    close={this.closeModal}
                    />
            </div>
        );
    }

    async componentDidMount(): Promise<void> {
        const spaces = await this.props.dataService.getSpaces();
        this.setState({ spaces });
    }

    private renderSpaces(): any {
        const rows: any[] = [];
        for (const space of this.state.spaces) {
            rows.push(
                <SpaceComponent key={space.id}
                    id={space.id}
                    name={space.name}
                    location={space.location}
                    photoUrl={space.photoUrl}
                    reserveSpace={this.reserveSpace} />
            );
        }
        return rows;
    }

    private closeModal(): void {
        this.setState({ showModal: false, modalContent: '' });
    }

    private async reserveSpace(id: string): Promise<void> {
        const result = await this.props.dataService.reserveSpace(id);
        if (result) {
            this.setState({ 
                showModal: true,
                modalContent: `We reserved space ${id} for you. Your reservation number is ${result}`,
            });
        } else {
            this.setState({ 
                showModal: true,
                modalContent: `Sorry, we couldn't reserve space ${id} for you. It's sold out already!`,
            });
        }
    }
}