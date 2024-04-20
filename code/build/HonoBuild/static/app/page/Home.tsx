import React from 'react';
import {Page, Layer, Col, Row} from '../component/Base.tsx';
import {Pulse0, Pulse1, BlurDot0, BlurDot1} from '../component/Effects.tsx';
import {ConnectButton} from '../component/ConnectButton.tsx';
import {NavbarItem, Navbar} from '../component/Navbar.tsx';
import {LogoAndBrand} from '../component/LogoAndBrand.tsx';
import {RenderedRow} from '../component/Rendered_.tsx';
import {Header} from '../component/Header.tsx';
import {Welcome} from "../component/Welcome.tsx";
import {RetroMinimaHeadline, RetroMinimaTaggedContainer} from "../component/RetroMinima.tsx";

export default function Home() {
    return (
        <Page>
            <Layer>
                <Pulse0></Pulse0>
                <Pulse1></Pulse1>
                <BlurDot0></BlurDot0>
                <BlurDot1></BlurDot1>
            </Layer>
            <Layer style={{justifyContent: 'space-between'}}>
                <RenderedRow nodeId='Navbar' w='100%' h='auto' initialStyle={{gap: '40px', justifyContent: 'space-between', padding: '40px'}} childrenMountCooldown={100n}>
                    <LogoAndBrand></LogoAndBrand>
                    <Navbar>
                        <NavbarItem nodeId='NavbarItem0' to='/' className='swing-in-top-fwd' text0='01' text1='Home'></NavbarItem>
                        <NavbarItem nodeId='NavbarItem1' to='/' className='swing-in-top-fwd' text0='02' text1='Protocol'></NavbarItem>
                        <NavbarItem nodeId='NavbarItem2' to='/' className='swing-in-top-fwd' text0='03' text1='Governance'></NavbarItem>
                        <NavbarItem nodeId='NavbarItem3' to='/' className='swing-in-top-fwd' text0='04' text1='Whitepaper'></NavbarItem>
                        <NavbarItem nodeId='NavbarItem4' to='/get-started' className='swing-in-top-fwd' text0='05' text1='Get Started'></NavbarItem>
                    </Navbar>
                    <ConnectButton></ConnectButton>
                </RenderedRow>
                <RetroMinimaTaggedContainer nodeId="" initialText="Headline"/>
            </Layer>
        </Page>
    );
}