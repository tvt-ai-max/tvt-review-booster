<?php
/**
 * Plugin Name: TVT Review Booster
 * Plugin URI: https://tvtagency.com/tvt-review-booster
 * Description: Intelligent Google Reviews sentiment gate & reputation shield. Routes positive ratings to Google Maps reviews and captures negative feedback privately with Telegram alerts.
 * Version: 1.0.0
 * Author: TVT Agency
 * Author URI: https://tvtagency.com
 * License: MIT
 * Requires PHP: 8.1
 * Text Domain: tvt-review-booster
 */

if (!defined('ABSPATH')) {
    exit;
}

define('TVT_RB_VERSION', '1.0.0');
define('TVT_RB_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('TVT_RB_PLUGIN_URL', plugin_dir_url(__FILE__));

class TVT_Review_Booster {
    private static ?TVT_Review_Booster $instance = null;

    public static function get_instance(): self {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        add_shortcode('tvt_review_booster', [$this, 'render_shortcode']);
        add_action('admin_menu', [$this, 'add_admin_menu']);
        add_action('admin_init', [$this, 'register_settings']);
    }

    public function render_shortcode(array|string $atts = []): string {
        $atts = shortcode_atts([
            'place_id'  => get_option('tvt_rb_place_id', ''),
            'min_stars' => get_option('tvt_rb_min_stars', '4'),
            'api_url'   => get_option('tvt_rb_api_url', 'http://localhost:3003'),
            'width'     => '100%',
            'height'    => '700',
        ], $atts, 'tvt_review_booster');

        $api_url = esc_url(rtrim($atts['api_url'], '/'));
        $place_id = esc_attr($atts['place_id']);
        $width = esc_attr($atts['width']);
        $height = esc_attr($atts['height']);

        return sprintf(
            '<div class="tvt-review-booster-wrapper">'
            . '<iframe src="%s/?place_id=%s" width="%s" height="%s" '
            . 'style="border:none;border-radius:12px;max-width:100%%;" '
            . 'loading="lazy" title="TVT Review Booster"></iframe>'
            . '</div>',
            $api_url,
            $place_id,
            $width,
            $height
        );
    }

    public function add_admin_menu(): void {
        add_options_page(
            'TVT Review Booster',
            'TVT Review Booster',
            'manage_options',
            'tvt-review-booster',
            [$this, 'render_settings_page']
        );
    }

    public function register_settings(): void {
        register_setting('tvt_rb_settings', 'tvt_rb_place_id', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('tvt_rb_settings', 'tvt_rb_min_stars', ['sanitize_callback' => 'absint']);
        register_setting('tvt_rb_settings', 'tvt_rb_api_url', ['sanitize_callback' => 'esc_url_raw']);
        register_setting('tvt_rb_settings', 'tvt_rb_telegram_token', ['sanitize_callback' => 'sanitize_text_field']);
        register_setting('tvt_rb_settings', 'tvt_rb_telegram_chat_id', ['sanitize_callback' => 'sanitize_text_field']);
    }

    public function render_settings_page(): void {
        if (!current_user_can('manage_options')) {
            return;
        }
        $api_url = get_option('tvt_rb_api_url', 'http://localhost:3003');
        ?>
        <div class="wrap">
            <h1>TVT Review Booster Settings</h1>
            <form method="post" action="options.php">
                <?php settings_fields('tvt_rb_settings'); ?>
                <table class="form-table">
                    <tr>
                        <th scope="row"><label for="tvt_rb_place_id">Google Place ID</label></th>
                        <td><input type="text" id="tvt_rb_place_id" name="tvt_rb_place_id"
                                   value="<?php echo esc_attr(get_option('tvt_rb_place_id')); ?>"
                                   class="regular-text" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="tvt_rb_min_stars">Minimum Stars for Google</label></th>
                        <td><input type="number" id="tvt_rb_min_stars" name="tvt_rb_min_stars"
                                   value="<?php echo esc_attr(get_option('tvt_rb_min_stars', '4')); ?>"
                                   min="1" max="5" /></td>
                    </tr>
                    <tr>
                        <th scope="row"><label for="tvt_rb_api_url">API Server URL</label></th>
                        <td><input type="url" id="tvt_rb_api_url" name="tvt_rb_api_url"
                                   value="<?php echo esc_attr($api_url); ?>"
                                   class="regular-text" /></td>
                    </tr>
                </table>
                <?php submit_button(); ?>
            </form>

            <hr />
            <h2>QR Code Tent Card</h2>
            <p>Print this QR code for table tent cards or invoice footers:</p>
            <div style="text-align:center; margin:20px 0;">
                <img src="<?php echo esc_url($api_url . '/api/v1/qr'); ?>"
                     alt="Review QR Code" style="max-width:300px;" />
            </div>
            <h3>Shortcode Usage</h3>
            <code>[tvt_review_booster]</code>
            <p>Or with custom attributes:</p>
            <code>[tvt_review_booster place_id="YOUR_PLACE_ID" min_stars="4"]</code>
        </div>
        <?php
    }
}

TVT_Review_Booster::get_instance();
