"""Brand fonts for the chart scripts: Jersey 25 for headlines, Montserrat for everything else.

The site loads these from Google Fonts (gatsby-config.mjs). matplotlib needs files, so they live in
scripts/fonts/ (SIL Open Font License; the OFL texts are beside them). Montserrat ships as a
variable font, which matplotlib cannot select weights from, so static instances were cut from it
with fontTools' instancer.
"""
from pathlib import Path

from matplotlib import font_manager, rcParams

FONTS = Path(__file__).resolve().parent / "fonts"
HEADLINE = "Jersey 25"
BODY = "Montserrat"


def use_brand_fonts():
    for name in ("Jersey25-Regular.ttf", "Montserrat-Regular.ttf", "Montserrat-Medium.ttf",
                 "Montserrat-SemiBold.ttf", "Montserrat-Bold.ttf"):
        font_manager.fontManager.addfont(str(FONTS / name))
    rcParams["font.family"] = BODY


def headline_font(size):
    """Jersey 25 has one weight and a small body, so headlines run about a third larger."""
    return dict(fontfamily=HEADLINE, fontweight="normal", fontsize=size * 1.38)
