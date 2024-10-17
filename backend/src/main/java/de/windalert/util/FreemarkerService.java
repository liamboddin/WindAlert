package de.windalert.util;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
import org.springframework.core.io.ClassRelativeResourceLoader;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.ui.freemarker.FreeMarkerConfigurationFactory;
import org.springframework.ui.freemarker.FreeMarkerTemplateUtils;

import java.io.IOException;
import java.io.StringReader;
import java.util.Locale;
import java.util.Properties;

import static java.nio.charset.StandardCharsets.UTF_8;

@Service
public class FreemarkerService {
    private final Configuration freeMarkerConfiguration;

    public FreemarkerService() throws TemplateException, IOException {

        final ResourceLoader resourceLoader = new ClassRelativeResourceLoader(this.getClass());
        final FreeMarkerConfigurationFactory fmcFactory = new FreeMarkerConfigurationFactory();
        final Properties settings = new Properties();
        // implies recognition of standard file extensions and auto-escape of html
        // entities such as <script> tags
        // see https://freemarker.apache.org/docs/pgui_config_outputformatsautoesc.html
        settings.put("incompatible_improvements", Configuration.VERSION_2_3_31.toString());
        fmcFactory.setFreemarkerSettings(settings);
        fmcFactory.setDefaultEncoding(UTF_8.name());
        fmcFactory.setResourceLoader(resourceLoader);
        fmcFactory.setTemplateLoaderPaths("./");
        fmcFactory.setPreferFileSystemAccess(false);
        this.freeMarkerConfiguration = fmcFactory.createConfiguration();
    }

    public String renderTemplate(final FreemarkerTemplate template, final Object model, final Locale locale)
            throws IOException, TemplateException {
        final String templateName = template.getFreeMarkerTemplate(locale);
        final Template freeMarkerTemplate = freeMarkerConfiguration.getTemplate(templateName, locale, UTF_8.name());
        return FreeMarkerTemplateUtils.processTemplateIntoString(freeMarkerTemplate, model);
    }

    public String renderTemplateString(final String templateString, final Object model)
            throws IOException, TemplateException {
        final Template template = new Template(null, new StringReader(templateString),
                new Configuration(Configuration.VERSION_2_3_31));
        return FreeMarkerTemplateUtils.processTemplateIntoString(template, model);
    }
}
