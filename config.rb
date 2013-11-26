# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = ""
css_dir = "styles"
fonts_dir = "fonts"
sass_dir = "scss"
images_dir = "images"
javascripts_dir = "scripts"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed
output_style = :nested

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = false

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass


#   -   -   -   -   -   -   - | -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   |
# PROPERTY NAME -   -   -   - | TYPE-   -   -   - | DEFAULTS TO -   -   -   -   -   -   -   -   -   -   - | DESCRIPTION -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   |
#   -   -   -   -   -   -   - | -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   |
# additional_import_paths     | Array of Strings  | -   -   -                                             | Other paths on your system from which to import sass files. See the add_import_path function for a simpler approach.                                    |
# chunky_png_options          | Hash              | {:compression => Zlib::BEST_COMPRESSION}              | See the chunky_png wiki for more information                                                                                                            |
# css_dir                     | String            | "stylesheets"                                         | The directory where the css stylesheets are kept. It is relative to the project_path.                                                                   |
# css_path                    | String            | <project_path>/<css_dir>                              | The full path to where css stylesheets are kept.                                                                                                        |
# disable_warnings            | Boolean           |                                                       | Set this to true to silence deprecation warnings.                                                                                                       |
# environment                 | Symbol            | :production, can also be :development                 | The environment mode.                                                                                                                                   |
# fonts_dir                   | String            | <css_dir>/fonts                                       | The directory where the font files are kept. Rails projects will default to "public/fonts".                                                             |
# fonts_path                  | String            | <project_path>/<fonts_dir>                            | The full path to where font files are kept.                                                                                                             |
# generated_images_dir        | String            | <images_dir>                                          | The directory where generated images are kept. It is relative to the project_path.                                                                      |
# generated_images_path       | String            | <project_path>/<generated_images_dir>                 | The full path to where generated images are kept.                                                                                                       |
# http_fonts_dir              | String            |                                                       | The relative http path to font files on the web server.                                                                                                 |
# http_fonts_path             | String            |                                                       | The full http path to font files on the web server.                                                                                                     |
# http_generated_images_path  | String            | http_path + "/" + generated_images_dir                | The full http path to generated images on the web server.                                                                                               |
# http_images_path            | String            | http_path + "/" + images_dir                          | The full http path to images on the web server.                                                                                                         |
# http_javascripts_path       | String            | http_path + "/" + javascripts_dir                     | The full http path to javascripts on the web server.                                                                                                    |
# http_path                   | String            | "/"                                                   | The path to the project when running within the web server.                                                                                             |
# http_stylesheets_path       | String            | http_path + "/" + css_dir                             | The full http path to stylesheets on the web server.                                                                                                    |
# images_dir                  | String            | "images"                                              | The directory where the images are kept. It is relative to the project_path.                                                                            |
# images_path                 | String            | <project_path>/<images_dir>                           | The full path to where images are kept.                                                                                                                 |
# javascripts_dir             | String            | "javascripts"                                         | The directory where the javascripts are kept. It is relative to the project_path.                                                                       |
# javascripts_path            | String            | <project_path>/<javascripts_dir>                      | The full path to where javascripts are kept.                                                                                                            |
# line_comments               | Boolean           | false in :prod. mode, true in :dev. mode              | Indicates whether line comments should be added to compiled css that says where the selectors were defined.                                             |
# output_style                | Symbol            |                                                       | The output style for the compiled css. One of: :nested, :expanded, :compact, or :compressed.                                                            |
# preferred_syntax            | Symbol            | :scss                                                 | Can be :scss or :sass.                                                                                                                                  |
# project_path                | String            |                                                       | Not needed in :stand_alone mode where it can be inferred by context. Sets the path to the root of the project.                                          |
# project_type                | Symbol            | :stand_alone                                          | Can be :stand_alone or :rails.                                                                                                                          |
# relative_assets             | Boolean           |                                                       | Indicates if compass helper functions generate relative urls from the generated css to assets, or absolute urls using the http path per asset type.     |
# sass_dir                    | String            | "sass"                                                | The directory where the sass stylesheets are kept. It is relative to the project_path.                                                                  |
# sass_options                | Hash              |                                                       | These options are passed directly to the Sass compiler. For more details on the format of sass options, please read the sass options documentation.     |
# sass_path                   | String            | <project_path>/<sass_dir>                             | The full path to where sass stylesheets are kept.                                                                                                       |
# sprite_engine               | Symbol            | :chunky_png                                           | -   -   -                                                                                                                                               |
# sprite_load_path            | Array             | <images_path>                                         | -   -   -                                                                                                                                               |
#   -   -   -   -   -   -   - | -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   |
#   -   -   -   -   -   -   - | -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   - | -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   -   |
