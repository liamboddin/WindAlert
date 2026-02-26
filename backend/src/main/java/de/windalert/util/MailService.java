package de.windalert.util;

import freemarker.template.TemplateException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import static java.nio.charset.StandardCharsets.UTF_8;
import static org.springframework.mail.javamail.MimeMessageHelper.MULTIPART_MODE_RELATED;

@Slf4j
@Component
public class MailService {

    private final JavaMailSender mailSender;
    private final FreemarkerService freemarkerService;

    public MailService(JavaMailSender mailSender, FreemarkerService freemarkerService) {
        this.mailSender = mailSender;
        this.freemarkerService = freemarkerService;
    }

    public void sendMail(String to, String subject, List<SpotStringified> spotStringifiedList) {
        Map<String, Object> bodyModel = Map.of("spots", spotStringifiedList);
        try {
            String bodyText = freemarkerService.renderTemplate(FreemarkerTemplate.WIND_INFORMATION, bodyModel, Locale.GERMANY);
            MimeMessage mimeMessage = prepareMessage("ostseeliam@gmail.com", "Wind Alert", to, subject,
                    bodyText);
            mailSender.send(mimeMessage);
        } catch (TemplateException | IOException | MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    public void sendMail(String to, String subject, String text) {
        try {
            MimeMessage mimeMessage = prepareMessage("ostseeliam@gmail.com", "Wind Alert", to, subject,
                    text);
            mailSender.send(mimeMessage);
        } catch (IOException | MessagingException e) {
            throw new RuntimeException(e);
        }
    }

    private MimeMessage prepareMessage(final String from, final String personal, final String to,
                                       final String subject, final String bodyText)
            throws MessagingException, UnsupportedEncodingException {
        final MimeMessage mimeMessage = mailSender.createMimeMessage();
        final MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, MULTIPART_MODE_RELATED, UTF_8.name());

        helper.setFrom(from, personal);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(bodyText, true);

        return mimeMessage;
    }
}
