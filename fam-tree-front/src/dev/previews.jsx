import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import {AdhesionForm} from "../pages/adhesion/AdhesionForm";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/AdhesionForm">
                <AdhesionForm/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews