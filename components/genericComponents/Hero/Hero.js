import { storyblokEditable } from "@storyblok/react";
import React from "react";
import css from "./Hero.module.scss";
import PropTypes from "prop-types";
import { modifyStoryBlokImage } from "../../../functions/StoryBlokImageHelper";
import "lazysizes";
import "lazysizes/plugins/attrchange/ls.attrchange";
import { RichTextToHTML } from "../../../functions/storyBlokRichTextRenderer"; 
import { getDefaultStoryBlokImageSet } from "../../../functions/StoryBlokImageHelper";


export default function Hero({ blok }) {
	let showImage = (blok.image && blok.image.filename);
	let colorCssName = "--" + (blok.colorcode?.content?.title || "default");
	let titleString = typeof blok.title === "string" ? blok.title : undefined;
	let taglineString = typeof blok.tagline === "string" ? blok.tagline : undefined;

	return (
		<>
			<div {...storyblokEditable(blok)} className={css["hero" + colorCssName]}>
				<div className={[css["hero__container"], css["hero__container"]].join(" ")}>
					<div className={[css["hero__title-group"], css["hero__title-group"]].join(" ")}>
						<p className={css["hero__tag"]}>{blok.supertitle}</p>
						<h1 className={css["hero__title"]}>{titleString || RichTextToHTML({ document: blok.title, textClassName: css["hero__title"], boldClassName: css["hero__title--highlighted" + colorCssName] })}</h1>
						<div className={css["hero__subtitle"]}>{taglineString || RichTextToHTML({ document: blok.Tagline, textClassName: css["hero__subtitle"] })}</div>
						{blok.tags && blok.tags.length > 0 && <TagList tags={blok.tags} variation={"white"} center />}
					</div>
					{showImage &&
						<figure className={css["hero__image-responsive-wrapper"]}>
							{getDefaultStoryBlokImageSet(blok.image.filename, blok.image.alt, { largestImageWidth: 870, largestImageHeigth: 870 }, 850, css["hero__image"])}
						</figure>
					}

				</div>
			</div>
		</>
		
	);
}

Hero.propTypes = {
	blok: PropTypes.object
};
