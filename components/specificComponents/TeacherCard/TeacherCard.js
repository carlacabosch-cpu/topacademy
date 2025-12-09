import React, { Component } from "react";
import css from "./TeacherCard.module.scss";
import { storyblokEditable } from "@storyblok/react";
import { RichTextToHTML } from "../../../functions/storyBlokRichTextRenderer";
import Link from "next/link";

export default class TeacherCard extends Component {

	constructor(props) {
		super(props);

	}

	render() {
		return (
			<>
				<div {...storyblokEditable(this.props.blok.content)} className={css["item"]}> 
					<Link className={css["link"]} href={`${this.props.blok.full_slug}`}>
						<div className={css["header"]}>
							<span className={css["title"]}>Tourguide: {this.props.blok.content.title}</span>
						</div>
					</Link>
				</div>
			</>
		);
	}
}