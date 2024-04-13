import {Col} from './Base.tsx';
import {RenderedText} from './Rendered.tsx';

export type ILogoAndBrandProps = ({});

export function LogoAndBrand(props: ILogoAndBrandProps) {
    const {} = props;

    const args = ({
        style: ({
            width: "165px",
            height: "45px",
            borderWidth: "1px",
            borderStyle: "solid",
            borderImage: "linear-gradient(to bottom, transparent, #505050) 1"
        }),
        initialClassName: "swing-in-top-fwd"
    }) as const;

    const logoArgs = ({
        style: ({
            backgroundImage: "url('../image/SteelLogo.png')",
            backgroundSize: "contain",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            width: "25px",
            height: "25px",
            position: "relative",
            bottom: "10px"
        })
    }) as const;

    const nameArgs = ({
        nodeId: "",
        initialText: "Dreamcatcher",
        initialStyle: ({
            fontSize: "20px",
            position: "relative",
            bottom: "10px"
        })
    }) as const;

    return (
        <Col {...args}>
            <Col {...logoArgs}></Col>
            <RenderedText {...nameArgs}></RenderedText>
        </Col>
    );
}