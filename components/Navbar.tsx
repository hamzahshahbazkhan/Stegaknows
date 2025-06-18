import GithubIcon from "./ui/githubicon";

export const Navbar = () => {
  return (
    <div className="h-16 w-full border-b-2 border-border bg-main text-4xl font-base flex items-center justify-between px-4">
      <div>Stegaknows</div>
      <a href="https://github.com/hamzahshahbazkhan/stegaknows">
        <GithubIcon />
      </a>
    </div>
  );
};
