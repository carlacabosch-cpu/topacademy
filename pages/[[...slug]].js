import { useStoryblokState, getStoryblokApi, StoryblokComponent } from "@storyblok/react";
import HeadComponent from "../components/technicalComponents/HeadComponent/HeadComponent";
import { getTags } from "../functions/services/metaTagService";

export default function Page({ story, preview, socialtags, menu }) {
  story = useStoryblokState(story, { //Hook that connects the current page to the Storyblok Real Time visual editor. Needs information about the relations in order for the relations to be editable as well.
    resolveRelations: [
      "hero.colorcode",
      "leftrightblock.colorcode",
      "course.colorcode",
      "artist.colorcode",
      "song.colorcode",
      "person.colorcode",
      "product.colorcode",
      "location.colorcode",
      "leader.colorcode",
      "artist.songs",
      "song.artist",
      "course.teachers",
      "course.products",
      "leader.location",
      "list.elements"
    ]
  }, preview);

  return (
    <>
      <HeadComponent socialTags={socialtags} />
      <StoryblokComponent menu={menu} blok={story.content} />
    </>
  );
}


export async function getStaticProps({ params }) {
  let slug = params.slug ? params.slug.join("/") : "home";

  let sbParams = {
    version: "draft", // 'draft' or 'published'
    resolve_relations: [
      "hero.colorcode",
      "leftrightblock.colorcode",
      "course.colorcode",
      "artist.colorcode",
      "song.colorcode",
      "person.colorcode",
      "product.colorcode",
      "location.colorcode",
      "leader.colorcode",
      "artist.songs",
      "song.artist",
      "course.teachers",
      "course.products",
      "leader.location",
      "list.elements"
    ]
  };

  const storyblokApi = getStoryblokApi();

  let data;
  try {
    const res = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);
    data = res.data;
  } catch (err) {
    console.error("Storyblok get story error", {
      slug,
      status: err.response?.status,
      response: err.response?.data || err.message,
    });

    // If requesting draft and we got 404, retry with published version
    if (sbParams.version === "draft" && err.response?.status === 404) {
      try {
        const retryRes = await storyblokApi.get(`cdn/stories/${slug}`, { ...sbParams, version: "published" });
        data = retryRes.data;
      } catch (retryErr) {
        console.error("Retry with published failed", { slug, status: retryErr.response?.status, response: retryErr.response?.data || retryErr.message });
        return { notFound: true };
      }
    } else {
      return { notFound: true };
    }
  }

  if (!data) {
    return {
      notFound: true,
    }
  }

  //getting menu data needed throughout the site
  let menudata;
  try {
    const res = await storyblokApi.get(`cdn/stories/reusable/headermenu`, sbParams);
    menudata = res.data;
  } catch (err) {
    console.error("Storyblok get menu error", { status: err.response?.status, response: err.response?.data || err.message });
    if (sbParams.version === "draft" && err.response?.status === 404) {
      try {
        const retryRes = await storyblokApi.get(`cdn/stories/reusable/headermenu`, { ...sbParams, version: "published" });
        menudata = retryRes.data;
      } catch (retryErr) {
        console.error("Retry menu with published failed", { status: retryErr.response?.status, response: retryErr.response?.data || retryErr.message });
        return { notFound: true };
      }
    } else {
      return { notFound: true };
    }
  }
  const menu = menudata?.data?.story || {};

  if (!data || !data.story) {
    console.error("Story data missing for slug", slug, data);
    return { notFound: true };
  }

  const title = data.story.name;
  const description = data.story.content?.tagline ? data.story.content.tagline : `${title}`;
  const socialtags = getTags({
    storyblokSocialTag: data.story.content?.socialtag,
    pageDefaults: {
      "og:title": title,
      "og:description": description,
      "og:url": `${process.env.NEXT_PUBLIC_DEPLOY_URL}` + slug
    }
  });

  return {
    props: {
      story: data ? data.story : false,
      key: data ? data.story.id : false,
      socialtags,
      menu
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const storyblokApi = getStoryblokApi();

  let linksData;
  try {
    const res = await storyblokApi.get("cdn/links/");
    linksData = res.data;
  } catch (err) {
    console.error("Storyblok get links error", { status: err.response?.status, response: err.response?.data || err.message });
    if (err.response?.status === 404) {
      try {
        const retryRes = await storyblokApi.get("cdn/links/", { version: "published" });
        linksData = retryRes.data;
      } catch (retryErr) {
        console.error("Retry links with published failed", { status: retryErr.response?.status, response: retryErr.response?.data || retryErr.message });
        return { paths: [], fallback: 'blocking' };
      }
    } else {
      return { paths: [], fallback: 'blocking' };
    }
  }

  let paths = [];
  Object.keys(linksData.links).forEach((linkKey) => {
    if (linksData.links[linkKey].is_folder) {
      return;
    }

    const slug = linksData.links[linkKey].slug;
    let splittedSlug = slug.split("/");

    paths.push({ params: { slug: splittedSlug } });
  });

  return {
    paths: paths,
    fallback: 'blocking'
  };
}